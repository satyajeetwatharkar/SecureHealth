import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import NewPatientModal from "./NewPatientModal";

export default async function DashboardHome() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const userId = session?.user?.id;

    // Fetch dynamic stats based on role
    let stats: { name: string, stat: string | number }[] = [];

    if (role === "PATIENT" && userId) {
        const myAppointmentsCount = await prisma.appointment.count({ where: { patientId: userId } });
        const myRecordsCount = await prisma.medicalRecord.count({ where: { patientId: userId } });
        stats = [
            { name: 'My Appointments', stat: myAppointmentsCount },
            { name: 'My Medical Records', stat: myRecordsCount },
            { name: 'Health Status', stat: 'Good' },
        ];
    } else {
        const totalPatients = await prisma.user.count({ where: { role: 'PATIENT' } });
        const scheduledAppointments = await prisma.appointment.count({ where: { status: 'SCHEDULED' } });
        const totalDoctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
        stats = [
            { name: 'Total Patients', stat: totalPatients },
            { name: 'Appointments Scheduled', stat: scheduledAppointments },
            { name: 'Active Doctors', stat: totalDoctors },
        ];
    }

    let flaggedAudits: any[] = [];
    if (role === "ADMIN") {
        flaggedAudits = await prisma.auditLog.findMany({
            where: { aiFlagged: true },
            orderBy: { timestamp: 'desc' },
            take: 5
        });
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-lg shadow-sm border border-slate-100 gap-4">
                <div>
                    <h3 className="text-xl font-semibold leading-6 text-slate-900">Welcome back, {session?.user?.name || 'User'}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        You are logged in with <span className="font-semibold text-blue-600">{role}</span> privileges.
                    </p>
                </div>
                {(role === "ADMIN" || role === "DOCTOR" || role === "RECEPTIONIST") && (
                    <NewPatientModal />
                )}
            </div>

            {/* Stats Board */}
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                    <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-slate-100">
                        <dt className="truncate text-sm font-medium text-slate-500">{item.name}</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{item.stat}</dd>
                    </div>
                ))}
            </dl>

            {/* AI Security Alerts Area (Admin Only) */}
            {role === "ADMIN" && (
                <div className="mt-8 bg-white shadow sm:rounded-lg overflow-hidden border border-red-100">
                    <div className="px-4 py-5 sm:px-6 bg-red-50/30 flex justify-between items-center">
                        <div>
                            <h3 className="text-base font-semibold leading-6 text-red-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                AI Agent Security Alerts
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-red-600">
                                Suspicious access patterns detected by Gemini.
                            </p>
                        </div>
                        <a href="/dashboard/audit" className="text-sm font-medium text-red-600 hover:text-red-500">View all &rarr;</a>
                    </div>
                    <div className="border-t border-red-100">
                        {flaggedAudits.length === 0 ? (
                            <div className="p-6 text-center text-sm text-slate-500 bg-white">
                                System secure. No anomalies detected recently.
                            </div>
                        ) : (
                            <ul role="list" className="divide-y divide-slate-100">
                                {flaggedAudits.map((audit) => (
                                    <li key={audit.id} className="p-4 hover:bg-slate-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Action: {audit.action}</p>
                                                <p className="text-xs text-red-600 font-mono mt-1 w-full truncate max-w-md">{audit.aiReasoning}</p>
                                            </div>
                                            <div className="text-xs text-slate-500">{new Date(audit.timestamp).toLocaleString()}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
