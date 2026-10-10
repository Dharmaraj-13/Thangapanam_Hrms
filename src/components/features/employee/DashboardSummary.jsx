import React from 'react';
import { Megaphone, Printer } from 'lucide-react';
import Card from '../../ui/Card';
import { formatCurrency } from '../../../utils/helpers';

export default function DashboardSummary({ salary, emp, announcements, onShowPayslip }) {
    const latestAnnouncements = announcements?.sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {/* Salary Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="text-indigo-100 text-sm font-medium mb-1">Projected Net Salary</div>
                    <div className="text-4xl font-bold mb-6 tracking-tight">{formatCurrency(salary.net)}</div>
                    <button
                        onClick={onShowPayslip}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 backdrop-blur-md transition-all border border-white/10 group-hover:scale-105 active:scale-95"
                    >
                        <Printer size={16} /> View Payslip
                    </button>
                </div>
            </div>

            {/* Announcements Widget */}
            <Card className="col-span-2 flex flex-col h-full" padding="p-6">
                <div className="flex items-center gap-2 mb-4 text-indigo-700">
                    <div className="bg-indigo-100 p-2 rounded-lg"><Megaphone size={18} /></div>
                    <h3 className="font-bold text-slate-800">Latest Announcements</h3>
                </div>
                <div className="space-y-3 overflow-y-auto pr-2 flex-1 max-h-48 scrollbar-thin scrollbar-thumb-slate-200">
                    {latestAnnouncements.length === 0 ? (
                        <p className="text-slate-400 text-sm italic py-4">No new announcements to display.</p>
                    ) : latestAnnouncements.map(a => (
                        <div key={a.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                            <div className="text-sm font-semibold text-slate-800 leading-snug">{a.message}</div>
                            <div className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wide">
                                {new Date(a.date).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="col-span-1 md:col-span-3">
                <h3 className="font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                    Compensation Breakdown
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
                    <StatBox label="Basic Pay" value={salary.basic} />
                    <StatBox label="HRA (40%)" value={salary.hra} />
                    <StatBox label={`DA (${emp.salaryConfig?.daPercent || 10}%)`} value={salary.da} />
                    <StatBox label="Special Allow." value={salary.special} />
                </div>

                <div className="border-t border-slate-100 my-6"></div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
                    <StatBox label="PF Deduction" value={-salary.pfAmount} isDeduction />
                    <StatBox label={`LOP (${salary.absents} days)`} value={-salary.lopAmount} isDeduction />
                    <div className="hidden lg:block"></div>
                    <div className="text-slate-800">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gross Earnings</div>
                        <div className="font-bold text-2xl text-slate-900">{formatCurrency(salary.grossEarning)}</div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function StatBox({ label, value, isDeduction = false }) {
    return (
        <div>
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDeduction ? 'text-red-400' : 'text-slate-400'}`}>{label}</div>
            <div className={`font-semibold text-lg ${isDeduction ? 'text-red-600' : 'text-slate-700'}`}>{formatCurrency(value)}</div>
        </div>
    );
}
