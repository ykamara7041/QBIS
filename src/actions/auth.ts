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

  let newUser
  try {
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return { error: "Email is already registered. Please sign in instead." }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    newUser = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
      },
    })

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
  } catch (error: any) {
    console.error("Failed to register user in database:", error)
    return { error: "Database error during registration. Please verify database connection." }
  }

  try {
    const cookieStore = await cookies()
    cookieStore.set("qbix_session", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    })
  } catch (error) {
    // NextAuth signIn success or redirect exception
  }

  return { success: true, redirectTo: "/dashboard" }
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

  let user = null

  // 1. Safe Database Authentication Check
  try {
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

    user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })
  } catch (error: any) {
    console.error("Database connection error in loginUser:", error)
    return { error: "Unable to connect to database. Please check your database settings." }
  }

  if (!user || !user.passwordHash) {
    return { error: "Account not found. Please click Sign Up to create your account." }
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isValidPassword) {
    return { error: "Incorrect password. Please check your credentials and try again." }
  }

  // 2. Set Session Cookie
  try {
    const cookieStore = await cookies()
    cookieStore.set("qbix_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (e) {
    console.error("Error setting session cookie:", e)
  }

  // 3. Perform NextAuth Sign In
  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Authentication failed. Please check your credentials." }
    }
  }

  return { success: true, redirectTo: "/dashboard" }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("qbix_session")
  cookieStore.delete("__Secure-authjs.session-token")
  cookieStore.delete("authjs.session-token")
  cookieStore.delete("__Secure-next-auth.session-token")
  cookieStore.delete("next-auth.session-token")
  try {
    await signOut({ redirect: false })
  } catch (e) {
    // Ignore signOut redirect throw
  }
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
    const cookieStore = await cookies()
    const fallbackUserId = cookieStore.get("qbix_session")?.value
    const activeUserId = session?.user?.id || fallbackUserId

    if (!activeUserId) {
      return { error: "Not authenticated" }
    }

    const currentUser = await db.user.findUnique({
      where: { id: activeUserId },
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
      where: { id: activeUserId },
      data: updateData,
    })

    return { success: "Account updated successfully!" }
  } catch (error) {
    console.error("Failed to update account:", error)
    return { error: "Failed to update account" }
  }
}
