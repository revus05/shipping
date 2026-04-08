import bcrypt from "bcryptjs"
import { db } from "@/lib/db"


async function main() {
  console.log("Seeding database...")

  // Create admin user
  const adminEmail = "admin@tradeworks.com"
  const existing = await db.user.findUnique({ where: { email: adminEmail } })

  if (!existing) {
    await db.user.create({
      data: {
        email: adminEmail,
        name: "System Admin",
        role: "ADMIN",
        passwordHash: await bcrypt.hash("admin123!", 12),
      },
    })
    console.log(`✓ Admin user created: ${adminEmail} / admin123!`)
  } else {
    console.log(`→ Admin user already exists: ${adminEmail}`)
  }

  // Create a worker user
  const workerEmail = "worker@tradeworks.com"
  const existingWorker = await db.user.findUnique({ where: { email: workerEmail } })

  if (!existingWorker) {
    await db.user.create({
      data: {
        email: workerEmail,
        name: "Trade Worker",
        role: "WORKER",
        passwordHash: await bcrypt.hash("worker123!", 12),
      },
    })
    console.log(`✓ Worker user created: ${workerEmail} / worker123!`)
  } else {
    console.log(`→ Worker user already exists: ${workerEmail}`)
  }

  console.log("Seeding complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
