import { PrismaClient } from "@prisma/client"
import pg from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const prismaClientSingleton = () => {
  const envUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL || ""
  
  if (!envUrl || envUrl.trim() === "" || envUrl.includes("placeholder")) {
    console.warn("WARNING: No valid DATABASE_URL or POSTGRES_URL found. Initializing standard PrismaClient.")
    return new PrismaClient()
  }

  try {
    let connectionString = envUrl
    try {
      const url = new URL(envUrl)
      url.searchParams.delete("sslmode")
      url.searchParams.delete("pgbouncer")
      connectionString = url.toString()
    } catch (e) {
      // ignore parse errors
    }
    
    const isLocal = envUrl.includes("localhost") || envUrl.includes("127.0.0.1")
    const pool = new pg.Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    })
    
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error("Failed to initialize PrismaPg adapter, falling back to default PrismaClient:", error)
    return new PrismaClient()
  }
}

declare const globalThis: {
  prismaGlobal2: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal2 ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal2 = db
