"use client";

import { useState } from "react";
import { createMedicalRecord } from "./actions";

export default function NewRecordModal({ patients }: { patients: { id: string; name: string | null; email: string | null }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        try {
            await createMedicalRecord(formData);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to create record:", error);
            alert("Failed to create record. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                Add Record
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-500/75 p-4 sm:p-0" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    {/* Background overlay */}
                    <div className="fixed inset-0" aria-hidden="true" onClick={() => setIsOpen(false)}></div>

                    {/* Modal panel */}
                    <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                            Create New Medical Record
                                        </h3>
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
                                                <input type="text" id="patientName" name="patientName" list="patient-list" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="e.g. John Doe" />
                                                <datalist id="patient-list">
                                                    {patients.map(p => (
                                                        <option key={p.id} value={p.name || p.email || ""} />
                                                    ))}
                                                </datalist>
                                                <p className="mt-1 text-xs text-slate-500">If the patient is new, an account will be created automatically.</p>
                                            </div>
                                            <div>
                                                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">Diagnosis</label>
                                                <input type="text" name="diagnosis" id="diagnosis" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="e.g., Seasonal Allergies" />
                                            </div>
                                            <div>
                                                <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">Prescription (Optional)</label>
                                                <input type="text" name="prescription" id="prescription" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="e.g., Antihistamines 10mg" />
                                            </div>
                                            <div>
                                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Doctor&apos;s Notes (Optional)</label>
                                                <textarea name="notes" id="notes" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="Additional observations..."></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    {loading ? "Saving & Hashing..." : "Save Record"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
