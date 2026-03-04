"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPatient(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "DOCTOR" && session.user?.role !== "RECEPTIONIST")) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
        throw new Error("Missing required fields");
    }

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                role: "PATIENT",
            }
        });
    } catch (e: any) {
        if (e.code === 'P2002') {
            throw new Error("A user with this email already exists.");
        }
        throw e;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/records");
    revalidatePath("/dashboard/appointments");
}
