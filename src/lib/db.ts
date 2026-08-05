import { PrismaClient } from "@prisma/client"
import pg from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const prismaClientSingleton = () => {
  const envUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL || "postgres://dummy:dummy@localhost:5432/dummy"
  
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
}

declare const globalThis: {
  prismaGlobal2: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal2 ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal2 = db
