import React from 'react';
import { LogOut } from 'lucide-react';

export default function EmployeeLayout({ children, user, activeTab, onTabChange, onLogout }) {
    const tabs = ['summary', 'attendance', 'leaves', 'profile'];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden border border-indigo-200">
                            {user.name[0]}
                        </div>
                        <div className="hidden sm:block">
                            <div className="font-bold text-slate-800 text-sm leading-tight">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.role}</div>
                        </div>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto scrollbar-hide max-w-[200px] sm:max-w-none">
                        {tabs.map(t => (
                            <button
                                key={t}
                                onClick={() => onTabChange(t)}
                                className={`px-3 py-1.5 rounded-md text-sm capitalize whitespace-nowrap transition-all duration-200 ${activeTab === t
                                        ? 'bg-white shadow-sm text-indigo-600 font-medium'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onLogout}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4 sm:p-6 animate-fade-in">
                {children}
            </main>
        </div>
    );
}
