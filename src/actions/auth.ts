"use server"

import { db } from "@/lib/db"
import { signIn, signOut } from "@/../auth"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { AuthError } from "next-auth"

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
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/onboarding",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Something went wrong during login" }
    }
    throw error // Required for Next.js redirects to work
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
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }
    throw error // Required for Next.js redirects to work
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" })
}

export async function googleSignIn() {
  await signIn("google", { redirectTo: "/dashboard" })
}
