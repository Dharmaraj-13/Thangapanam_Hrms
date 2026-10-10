import React from 'react';
import Card from '../../ui/Card';

export default function Profile({ emp }) {
    return (
        <Card className="animate-fade-in max-w-4xl mx-auto" padding="p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 border-b border-slate-100 pb-10">
                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-4xl font-bold text-slate-400 border-4 border-white shadow-xl">
                    {emp.name[0]}
                </div>
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{emp.name}</h2>
                    <p className="text-lg text-slate-500 font-medium mb-3">{emp.role} • {emp.department}</p>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold uppercase tracking-wide">
                        {emp.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 border-l-4 border-indigo-500 pl-3">Contact Information</h4>
                    <div className="space-y-6">
                        <MetaRow label="Email Address" value={emp.email} />
                        <MetaRow label="Phone Number" value={emp.phone} />
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 border-l-4 border-indigo-500 pl-3">Employment Information</h4>
                    <div className="space-y-6">
                        <MetaRow label="Employee ID" value={`EMP-${emp.id}`} />
                        <MetaRow label="Date of Joining" value={emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : 'N/A'} />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-l-4 border-indigo-500 pl-3">Residential Address</h4>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed max-w-2xl text-sm">
                        {emp.address || <span className="text-slate-400 italic">No address on file. Please contact Admin to update.</span>}
                    </div>
                </div>
            </div>
        </Card>
    );
}

function MetaRow({ label, value }) {
    return (
        <div>
            <div className="text-xs text-slate-500 font-medium uppercase mb-1">{label}</div>
            <div className="text-base font-semibold text-slate-800">{value || <span className="text-slate-300 text-sm font-normal italic">Not Provided</span>}</div>
        </div>
    );
}
