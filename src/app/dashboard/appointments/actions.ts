"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAppointment(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "RECEPTIONIST")) {
        throw new Error("Unauthorized");
    }

    const patientName = formData.get("patientName") as string;
    const doctorId = formData.get("doctorId") as string;
    const dateStr = formData.get("date") as string;
    const reason = formData.get("reason") as string;

    if (!patientName || !doctorId || !dateStr || !reason) {
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

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date formatted provided");
    }

    await prisma.appointment.create({
        data: {
            patientId,
            doctorId,
            date,
            reason,
            status: "SCHEDULED"
        }
    });

    revalidatePath("/dashboard/appointments");
}

export async function updateAppointment(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "RECEPTIONIST")) {
        throw new Error("Unauthorized");
    }

    const appointmentId = formData.get("appointmentId") as string;
    const doctorId = formData.get("doctorId") as string;
    const dateStr = formData.get("date") as string;
    const reason = formData.get("reason") as string;
    const status = formData.get("status") as any;

    if (!appointmentId || !doctorId || !dateStr || !reason || !status) {
        throw new Error("Missing required fields");
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date formatted provided");
    }

    await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
            doctorId,
            date,
            reason,
            status
        }
    });

    revalidatePath("/dashboard/appointments");
}
