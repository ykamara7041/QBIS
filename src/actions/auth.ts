"use server"

import { db } from "@/lib/db"
import { auth, signIn, signOut } from "@/../auth"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { AuthError } from "next-auth"
import { cookies } from "next/headers"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function registerUser(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validatedFields = registerSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message }
  }

  const { name, email, password } = validatedFields.data
  const normalizedEmail = email.toLowerCase().trim()

  try {
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return { error: "Email is already registered. Please sign in instead." }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
      },
    })

    // Check if user has an organization member entry; if not, create default org
    const existingMember = await db.organizationMember.findFirst({
      where: { userId: newUser.id }
    })

    if (!existingMember) {
      const org = await db.organization.create({
        data: {
          name: `${name}'s Organization`,
          defaultCurrency: "GNF"
        }
      })

      await db.organizationMember.create({
        data: {
          userId: newUser.id,
          organizationId: org.id,
          role: "SUPER_ADMIN"
        }
      })
    }
  } catch (error) {
    console.error("Failed to register:", error)
    return { error: "Failed to create account" }
  }

  try {
    const result = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    })
    if (result?.error) {
      return { error: "Account created! Please sign in with your password." }
    }
    return { success: true, redirectTo: "/dashboard" }
  } catch (error) {
    return { success: true, redirectTo: "/dashboard" }
  }
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function loginUser(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validatedFields = loginSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return { error: "Please enter a valid email address and password." }
  }

  const { email, password } = validatedFields.data
  const normalizedEmail = email.toLowerCase().trim()

  try {
    // If database has 0 users (fresh deployment) and email is admin@demo.com, auto-seed Super Admin
    const userCount = await db.user.count()
    if (userCount === 0 && normalizedEmail === "admin@demo.com") {
      const passwordHash = await bcrypt.hash(password, 10)
      const newAdmin = await db.user.create({
        data: {
          name: "Super Admin",
          email: "admin@demo.com",
          passwordHash,
        }
      })
      
      const org = await db.organization.create({
        data: {
          name: "QBIX Company",
          defaultCurrency: "GNF",
        }
      })

      await db.organizationMember.create({
        data: {
          userId: newAdmin.id,
          organizationId: org.id,
          role: "SUPER_ADMIN",
        }
      })
    }

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user || !user.passwordHash) {
      return { error: "Account not found. Please click Sign Up to create your account." }
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return { error: "Incorrect password. Please check your credentials and try again." }
    }

    // Authenticate with NextAuth
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    })

    return { success: true, redirectTo: "/dashboard" }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Authentication failed. Please verify your email and password." }
    }
    // NextAuth signIn success or redirect exception
    return { success: true, redirectTo: "/dashboard" }
  }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("__Secure-authjs.session-token")
  cookieStore.delete("authjs.session-token")
  cookieStore.delete("__Secure-next-auth.session-token")
  cookieStore.delete("next-auth.session-token")
  await signOut({ redirect: false })
  return { success: true }
}

const updateAccountSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
})

export async function updateAccountCredentials(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validatedFields = updateAccountSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message }
  }

  const { email, password } = validatedFields.data

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!currentUser) {
      return { error: "User not found" }
    }

    if (email !== currentUser.email) {
      const existingUser = await db.user.findUnique({
        where: { email },
      })
      if (existingUser) {
        return { error: "Email is already in use by another account" }
      }
    }

    const updateData: { email: string; passwordHash?: string } = {
      email,
    }

    if (password && password.length >= 6) {
      updateData.passwordHash = await bcrypt.hash(password, 10)
    }

    await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    return { success: "Account updated successfully!" }
  } catch (error) {
    console.error("Failed to update account:", error)
    return { error: "Failed to update account" }
  }
}
