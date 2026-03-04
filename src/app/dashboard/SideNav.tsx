"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav({ role }: { role: string }) {
    const pathname = usePathname();

    const linkClasses = (href: string, exact: boolean = false) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? "text-slate-900 bg-slate-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`;
    };

    return (
        <nav className="flex-1 p-4 space-y-1">
            <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</div>
            <Link href="/dashboard" className={linkClasses("/dashboard", true)}>
                Dashboard Home
            </Link>

            {/* Note: In this version, PATIENTS are also allowed to see their own records and appointments */}
            {(role === "ADMIN" || role === "DOCTOR" || role === "PATIENT") && (
                <Link href="/dashboard/records" className={linkClasses("/dashboard/records")}>
                    Medical Records
                </Link>
            )}

            {(role === "ADMIN" || role === "RECEPTIONIST" || role === "PATIENT") && (
                <Link href="/dashboard/appointments" className={linkClasses("/dashboard/appointments")}>
                    Appointments
                </Link>
            )}

            {role === "ADMIN" && (
                <>
                    <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2">Security Team</div>
                    <Link href="/dashboard/audit" className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full justify-between group ${pathname.startsWith("/dashboard/audit") ? "text-red-700 bg-red-100" : "text-red-600 bg-red-50/50 hover:bg-red-50"}`}>
                        <span>AI Audit Logs</span>
                        <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs group-hover:bg-red-200 transition-colors">Alerts</span>
                    </Link>
                </>
            )}
        </nav>
    );
}
