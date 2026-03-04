import { Shield, Brain, Database, Lock, Activity, Eye, FileDigit } from "lucide-react";
import Link from "next/link";

export default function Architecture() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">SecureHealth</span>
                    </div>
                    <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                        &larr; Back to Home
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
                        Platform Architecture
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
                        A state-of-the-art hybrid architecture combining traditional relational databases with immutable blockchain hashes and continuous AI-driven security auditing.
                    </p>
                </div>

                {/* Core Pillars */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                            <Database className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Core Data Layer</h3>
                        <p className="text-slate-600 leading-relaxed">
                            A robust PostgreSQL database handles high-speed transactions, fast relational queries, and structured health data storage, ensuring high availability and ACID compliance.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                            <Lock className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Blockchain Immutability</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Cryptographic hashes of sensitive medical records are anchored to an Ethereum-based Smart Contract, providing cryptographic certainty that historical data has not been tampered with.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                            <Brain className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">AI Threat Detection</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Google Gemini 2.5 Flash continuously monitors all system access logs and patient data modifications to immediately detect and flag anomalous insider behavior or unauthorized scraping.
                        </p>
                    </div>
                </div>

                {/* Technical Workflow */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
                    <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Data Integrity Workflow</h2>

                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 mt-1">1</div>
                            <div>
                                <h4 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <FileDigit className="h-5 w-5 text-blue-600" /> Data Ingestion
                                </h4>
                                <p className="text-slate-600 text-lg">Doctors and administrators create new medical records via the Next.js protected dashboard. Data is structured, validated, and temporarily held in memory.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 mt-1">2</div>
                            <div>
                                <h4 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-indigo-600" /> Dual-Layer Storage
                                </h4>
                                <p className="text-slate-600 text-lg">The medical record is persisted to the PostgreSQL database. Simultaneously, the system computes a SHA-256 hash of the record's contents and submits it as a transaction to the blockchain, receiving a transaction hash receipt.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 mt-1">3</div>
                            <div>
                                <h4 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-emerald-600" /> Background Auditing
                                </h4>
                                <p className="text-slate-600 text-lg">The AI Auditor daemon is triggered. It packages the context of the user, the time of day, the action performed, and the record interacted with, and sends this payload to the LLM to verify there is no malicious intent.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 mt-1">4</div>
                            <div>
                                <h4 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-blue-600" /> Verification & Retrieval
                                </h4>
                                <p className="text-slate-600 text-lg">When a user requests to view a record, the system queries PostgreSQL, re-hashes the retrieved data, and compares it against the immutable hash stored on the blockchain to guarantee the data hasn't been intercepted or modified.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all">
                        Try the Platform &rarr;
                    </Link>
                </div>
            </main>
        </div>
    );
}
