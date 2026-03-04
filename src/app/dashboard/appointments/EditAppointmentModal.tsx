"use client";

import { useState } from "react";
import { updateAppointment } from "./actions";

type UserBasic = { id: string; name: string | null; email: string | null };

type AppointmentBasic = {
    id: string;
    date: Date;
    reason: string;
    status: string;
    doctorId: string;
};

export default function EditAppointmentModal({ appointment, doctors }: { appointment: AppointmentBasic, doctors: UserBasic[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Format date for datetime-local input safely
    const offset = appointment.date.getTimezoneOffset() * 60000;
    const localIsoString = new Date(appointment.date.getTime() - offset).toISOString().slice(0, 16);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        formData.append("appointmentId", appointment.id);

        try {
            await updateAppointment(formData);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update appointment:", error);
            alert("Failed to update appointment. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="text-blue-600 hover:text-blue-900 font-medium ml-4 text-xs bg-blue-50 px-2 py-1 rounded"
            >
                Edit<span className="sr-only">, appointment</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-500/75 p-4 sm:p-0" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0" aria-hidden="true" onClick={() => setIsOpen(false)}></div>

                    <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                            Edit Appointment
                                        </h3>
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Select Doctor</label>
                                                <select id="doctorId" name="doctorId" defaultValue={appointment.doctorId} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                                                    {doctors.map(d => (
                                                        <option key={d.id} value={d.id}>{d.name || d.email}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date & Time</label>
                                                <input type="datetime-local" name="date" id="date" defaultValue={localIsoString} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                                                <button type="button" className="mt-2 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mb-2">
                                                    <svg className="h-3 w-3 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                    </svg>
                                                    Confirm Date Selection
                                                </button>
                                            </div>
                                            <div>
                                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Visit</label>
                                                <input type="text" name="reason" id="reason" defaultValue={appointment.reason} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                                            </div>
                                            <div>
                                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                                <select id="status" name="status" defaultValue={appointment.status} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                                                    <option value="SCHEDULED">Scheduled</option>
                                                    <option value="COMPLETED">Completed</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
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
                                    {loading ? "Updating..." : "Update Appointment"}
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
