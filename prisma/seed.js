const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding test users...");
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            name: 'System Admin',
            role: 'ADMIN',
        },
    });

    const doctorUser = await prisma.user.upsert({
        where: { email: 'doctor@test.com' },
        update: {},
        create: {
            email: 'doctor@test.com',
            name: 'Dr. Jane Smith',
            role: 'DOCTOR',
        },
    });

    const receptionistUser = await prisma.user.upsert({
        where: { email: 'receptionist@test.com' },
        update: {},
        create: {
            email: 'receptionist@test.com',
            name: 'Alice Receptionist',
            role: 'RECEPTIONIST',
        },
    });

    const patientUser = await prisma.user.upsert({
        where: { email: 'patient@test.com' },
        update: {},
        create: {
            email: 'patient@test.com',
            name: 'Bob Patient',
            role: 'PATIENT',
        },
    });

    console.log("Test users seeded!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
