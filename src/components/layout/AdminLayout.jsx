import React from 'react';
import { Users, Calendar, Briefcase, LogOut, Megaphone } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function AdminLayout({ children, activeView, onViewChange, onLogout }) {
    const navItems = [
        { id: 'employees', icon: <Users size={18} />, label: 'Employees' },
        { id: 'attendance', icon: <Calendar size={18} />, label: 'Attendance' },
        { id: 'leaves', icon: <Briefcase size={18} />, label: 'Requests' },
        { id: 'holidays', icon: <Calendar size={18} />, label: 'Holidays' },
        { id: 'announcements', icon: <Megaphone size={18} />, label: 'Announcements' },
    ];

    return (
        <div className="flex h-screen overflow-hidden text-slate-800 font-sans">
            <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 transition-all duration-300">
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">Admin Console</h2>
                    <p className="text-slate-400 text-sm">HRMS Suite</p>
                </div>

                <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeView === item.id
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors w-full px-4 py-2 hover:bg-slate-800 rounded-lg"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
