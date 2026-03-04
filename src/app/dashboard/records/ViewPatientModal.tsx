"use client";

import { useState } from "react";

type Patient = { id: string; name: string | null; email: string | null };

export default function ViewPatientModal({ patient }: { patient: Patient }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
                type="button"
                className="text-blue-600 hover:text-blue-900 font-medium whitespace-nowrap"
            >
                View Patient
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-500/75 p-4 sm:p-0" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0" aria-hidden="true" onClick={() => setIsOpen(false)}></div>

                    <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2" id="modal-title">
                                        Patient Details
                                    </h3>
                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                                            <p className="mt-1 text-base text-gray-900">{patient.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                                            <p className="mt-1 text-base text-gray-900">{patient.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Patient ID (Database Key)</p>
                                            <p className="mt-1 text-xs font-mono text-gray-900 bg-gray-50 p-2 rounded border">{patient.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
