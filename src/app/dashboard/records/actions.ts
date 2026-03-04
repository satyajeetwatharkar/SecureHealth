"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { keccak256, toHex, stringToHex } from "viem";

export async function createMedicalRecord(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "DOCTOR")) {
        throw new Error("Unauthorized");
    }

    const patientName = formData.get("patientName") as string;
    const diagnosis = formData.get("diagnosis") as string;
    const prescription = formData.get("prescription") as string | null;
    const notes = formData.get("notes") as string | null;
    const doctorId = session.user.id; // Record created by currently logged-in user

    if (!patientName || !diagnosis) {
        throw new Error("Missing required fields");
    }

    // Lookup or Create Patient
    let patientRecord = await prisma.user.findFirst({
        where: { name: patientName, role: "PATIENT" }
    });

    if (!patientRecord) {
        const email = patientName.replace(/\s+/g, '').toLowerCase() + Date.now().toString().slice(-4) + "@patient.com";
        patientRecord = await prisma.user.create({
            data: {
                name: patientName,
                email,
                role: "PATIENT",
            }
        });
    }

    const patientId = patientRecord.id;

    // Generate Blockchain Hash
    // We combine the fields into a single string to represent the "document"
    const dataToHash = `${patientId}-${doctorId}-${diagnosis}-${prescription || ""}-${notes || ""}-${Date.now()}`;
    // Using viem's keccak256 to create a cryptographic hash of this data
    const blockchainHash = keccak256(stringToHex(dataToHash));

    // Save to PostgreSQL Database
    await prisma.medicalRecord.create({
        data: {
            patientId,
            doctorId,
            diagnosis,
            prescription,
            notes,
            blockchainHash
        }
    });

    revalidatePath("/dashboard/records");
}
