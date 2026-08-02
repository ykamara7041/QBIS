"use server"

import { db } from "@/lib/db"
import { auth } from "@/../auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const createOrgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  industry: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  defaultCurrency: z.string().length(3, "Currency must be a 3-letter code (e.g., USD, GHS)"),
})

export async function createOrganization(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const rawData = {
    name: formData.get("name") as string,
    industry: formData.get("industry") as string,
    country: formData.get("country") as string,
    defaultCurrency: formData.get("defaultCurrency") as string,
  }

  const validatedFields = createOrgSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return { error: "Invalid fields provided. Please check the form." }
  }

  const { name, industry, country, defaultCurrency } = validatedFields.data

  try {
    const org = await db.organization.create({
      data: {
        name,
        industry,
        country,
        defaultCurrency,
        members: {
          create: {
            userId: session.user.id,
            role: "ORG_ADMIN",
          }
        }
      }
    })

    // After creating the organization, redirect them to the dashboard
  } catch (error) {
    console.error("Failed to create organization:", error)
    return { error: "Failed to create organization. Please try again." }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
