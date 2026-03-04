import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AuditPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // In a real app we fetch this from Prisma
    // const audits = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }});
    const mockAudits = [
        { id: "1", actorRole: "DOCTOR", action: "VIEW_RECORD", targetId: "PATIENT_2", timestamp: "2026-03-01 03:15 AM", aiFlagged: true, aiReasoning: "~ GEMINI 2.5 FLASH ~ Anomaly: Doctor accessed a patient record at 3:15 AM without an active appointment scheduled." },
        { id: "2", actorRole: "RECEPTIONIST", action: "UPDATE_APPOINTMENT", targetId: "APPT_8", timestamp: "2026-03-01 09:30 AM", aiFlagged: false, aiReasoning: "~ GEMINI 2.5 FLASH ~ Normal: Receptionist modifying appointment during business hours." },
    ];

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h2 className="text-xl font-semibold leading-6 text-red-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        AI Security Agent Logs
                    </h2>
                    <p className="mt-2 text-sm text-slate-700">Real-time analysis of system access events powered by Google Gemini 2.5 Flash.</p>
                </div>
            </div>

            <div className="mt-4 flex-1 overflow-hidden bg-white shadow sm:rounded-md border border-slate-200 flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <ul role="list" className="divide-y divide-gray-200">
                        {mockAudits.map((audit) => (
                            <li key={audit.id} className={`hover:bg-slate-50 ${audit.aiFlagged ? 'bg-red-50/20' : ''}`}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-blue-600 truncate flex items-center">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded uppercase">{audit.actorRole}</span>
                                            performed {audit.action} on {audit.targetId}
                                        </p>
                                        <div className="ml-2 flex flex-shrink-0">
                                            <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${audit.aiFlagged ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {audit.aiFlagged ? 'Anomaly Detected' : 'Verified'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-start text-sm text-gray-500 font-mono">
                                                <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
                                                </svg>
                                                {audit.aiReasoning}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                <time dateTime={audit.timestamp}>{audit.timestamp}</time>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
