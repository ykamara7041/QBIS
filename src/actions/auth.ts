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

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email already in use" }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await db.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })
  } catch (error) {
    console.error("Failed to register:", error)
    return { error: "Failed to create account" }
  }

  // After registration, sign them in directly using Auth.js
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      return { error: "Something went wrong during login" }
    }
    return { success: true, redirectTo: "/onboarding" }
  } catch (error) {
    console.error("NextAuth signIn error:", error)
    return { error: "Something went wrong during login" }
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
    return { error: "Invalid email or password" }
  }

  const { email, password } = validatedFields.data

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { error: "Invalid credentials." }
    }

    return { success: true, redirectTo: "/dashboard" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          console.error("NextAuth AuthError:", error)
          return { error: "Something went wrong." }
      }
    }
    console.error("NextAuth Unknown Error:", error)
    return { error: "Something went wrong." }
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

    // Check if new email is taken by someone else
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
