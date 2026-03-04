import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewRecordModal from "./NewRecordModal";
import ViewPatientModal from "./ViewPatientModal";

export default async function RecordsPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "DOCTOR" && session.user?.role !== "PATIENT")) {
        redirect("/dashboard");
    }

    // Fetch actual records from DB
    const records = await prisma.medicalRecord.findMany({
        where: session.user.role === "PATIENT" ? { patientId: session.user.id } : undefined,
        include: {
            patient: true,
            doctor: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // Fetch patients for the drop-down in the NewRecordModal
    let patients: any[] = [];
    if (session.user.role !== "PATIENT") {
        patients = await prisma.user.findMany({
            where: { role: "PATIENT" },
            select: { id: true, name: true, email: true }
        });
    }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h2 className="text-xl font-semibold leading-6 text-slate-900">Medical Records</h2>
                    <p className="mt-2 text-sm text-slate-700">A list of all {session.user.role === "PATIENT" ? 'your' : 'patient'} medical records. Hashes denote on-chain immutability.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    {session.user.role !== "PATIENT" && <NewRecordModal patients={patients} />}
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Patient</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Diagnosis</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Added</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Blockchain Hash</th>
                                        {session.user.role !== "PATIENT" && (
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">View</span></th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="whitespace-nowrap py-8 pl-4 pr-3 text-sm text-center text-gray-500 sm:pl-6">
                                                No medical records found. Create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        records.map((record) => (
                                            <tr key={record.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{record.patient?.name || record.patient?.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.diagnosis}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.createdAt.toLocaleDateString()}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-mono text-xs text-green-600 bg-green-50 rounded">
                                                    {record.blockchainHash ? `${record.blockchainHash.substring(0, 10)}...${record.blockchainHash.substring(record.blockchainHash.length - 8)}` : 'Pending'}
                                                </td>
                                                {session.user.role !== "PATIENT" && (
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        {record.patient && <ViewPatientModal patient={record.patient} />}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
