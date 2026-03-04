import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import SideNav from "./SideNav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const role = session.user?.role as string;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex-shrink-0 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg text-slate-900">SecureHealth</span>
                </div>

                <SideNav role={role} />

                <div className="p-4 border-t">
                    <div className="flex items-center mb-4 px-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center mr-3 text-slate-600 font-bold">
                            {session.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">{session.user?.name || "User"}</p>
                            <p className="text-xs text-slate-500 capitalize">{role.toLowerCase()}</p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-50">
                <header className="h-16 flex items-center px-8 border-b bg-white">
                    <h1 className="text-xl font-semibold text-slate-900">Patient Management Console</h1>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
