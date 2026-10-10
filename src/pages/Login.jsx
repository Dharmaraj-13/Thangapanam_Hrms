import React, { useState } from 'react';

export default function Login({ employees, onLogin }) {
    const [role, setRole] = useState('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submit = (e) => {
        e.preventDefault();
        setError('');

        // Helper to check employee login
        const checkEmployeeLogin = () => {
            const emp = employees.find(e =>
                e.name.toLowerCase().trim() === email.toLowerCase().trim() ||
                e.name.toLowerCase().includes(email.toLowerCase().trim()) ||
                e.id.toString() === email.trim()
            );
            if (emp) {
                if (emp.password === password.trim()) {
                    onLogin({ type: 'employee', data: emp });
                    return true;
                } else {
                    setError('Wrong password for ' + emp.name + ' (Default: 123)');
                    return true; // Found user, just wrong password
                }
            }
            return false;
        };

        if (role === 'admin') {
            if (email.trim() === 'admin' && password.trim() === 'admin') {
                onLogin({ type: 'admin', name: 'Super Admin' });
            } else {
                // Smart Login: Check if it's actually an employee trying to login
                const isEmployee = checkEmployeeLogin();
                if (!isEmployee) {
                    setError('Invalid Admin Credentials (Try admin/admin)');
                }
            }
        } else {
            const found = checkEmployeeLogin();
            if (!found) {
                setError('Employee "' + email + '" not found. Please select from the list below.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {/* Alternative "P" Style if preferred:
                        <span className="text-4xl font-black text-white">P</span>
                        */}
                    </div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Thangapanam</h1>
                    <p className="text-slate-500 mt-2">Enterprise Salary Portal</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                    <button onClick={() => setRole('admin')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === 'admin' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Admin Portal</button>
                    <button onClick={() => setRole('employee')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === 'employee' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Employee Portal</button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <input className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder={role === 'admin' ? "admin" : "e.g. Your Name (see below)"} value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} />
                    {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</div>}
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-lg transform active:scale-95 transition-transform">Login</button>
                </form>
                <div className="mt-6 text-center text-xs text-slate-400">
                    <p className="font-semibold mb-1">Demo Credentials:</p>
                    <p>Admin: admin / admin</p>
                    {employees && employees.length > 0 ? (
                        <div className="mt-4 text-left bg-slate-50 p-3 rounded-lg border border-slate-100 max-h-40 overflow-y-auto">
                            <span className="block font-medium text-slate-500 mb-2 text-xs uppercase tracking-wider">Available Employees (Click to Login)</span>
                            <div className="space-y-2">
                                {employees.map(e => (
                                    <div
                                        key={e.id}
                                        className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all group"
                                        onClick={() => {
                                            setEmail(e.name);
                                            setPassword(e.password); // Auto-fill password too
                                            setError('');
                                        }}
                                    >
                                        <div>
                                            <span className="font-medium text-slate-700 block">{e.name}</span>
                                            <span className="text-[10px] text-slate-400">{e.role}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                onLogin({ type: 'employee', data: e });
                                            }}
                                            className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors"
                                        >
                                            Auto Login
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="mt-2 text-red-400">No employees loaded. Check server connection.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
