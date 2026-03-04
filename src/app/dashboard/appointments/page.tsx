import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewAppointmentModal from "./NewAppointmentModal";
import EditAppointmentModal from "./EditAppointmentModal";

export default async function AppointmentsPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "RECEPTIONIST" && session.user?.role !== "PATIENT")) {
        redirect("/dashboard");
    }

    const appointments = await prisma.appointment.findMany({
        where: session.user.role === "PATIENT" ? { patientId: session.user.id } : undefined,
        include: {
            patient: true,
            doctor: true,
        },
        orderBy: {
            date: "asc"
        }
    });

    let patients: any[] = [];
    let doctors: any[] = [];

    if (session.user.role !== "PATIENT") {
        patients = await prisma.user.findMany({
            where: { role: "PATIENT" },
            select: { id: true, name: true, email: true }
        });

        doctors = await prisma.user.findMany({
            where: { role: "DOCTOR" },
            select: { id: true, name: true, email: true }
        });
    }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h2 className="text-xl font-semibold leading-6 text-slate-900">Appointments Schedule</h2>
                    <p className="mt-2 text-sm text-slate-700">Manage {session.user.role === "PATIENT" ? 'your ' : 'patient '}bookings and schedules.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    {session.user.role !== "PATIENT" && <NewAppointmentModal patients={patients} doctors={doctors} />}
                </div>
            </div>

            <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {appointments.length === 0 ? (
                        <li className="px-4 py-8 text-center text-sm text-gray-500">
                            No appointments scheduled. Create one.
                        </li>
                    ) : (
                        appointments.map((app) => (
                            <li key={app.id}>
                                <div className="flex items-center px-4 py-4 sm:px-6 hover:bg-slate-50">
                                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <div className="flex text-sm font-medium text-blue-600 truncate">
                                                <p>{app.patient?.name || app.patient?.email} <span className="font-normal text-slate-500">with {app.doctor?.name || app.doctor?.email}</span></p>
                                            </div>
                                            <div className="mt-2 flex">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                                                    </svg>
                                                    <p>{app.date.toLocaleString()}</p>
                                                    <span className="ml-2 text-slate-400">({app.reason})</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-shrink-0 items-center sm:mt-0 sm:ml-5">
                                            <p className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${app.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' : app.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {app.status}
                                            </p>
                                            {session.user.role !== "PATIENT" && (
                                                <EditAppointmentModal appointment={app} doctors={doctors} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
