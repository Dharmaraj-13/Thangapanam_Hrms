import React from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { formatCurrency } from '../../../utils/helpers';
import { Printer } from 'lucide-react';

export default function PayslipModal({ salary, emp, onClose, isOpen }) {
    if (!salary || !emp) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Payslip" maxWidth="max-w-2xl">
            <div className="relative">
                <div className="text-center border-b border-slate-100 pb-6 mb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">Payslip</h1>
                    <p className="text-slate-500 text-sm font-medium">Thangapanam</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                        <h4 className="font-bold border-b border-slate-100 pb-2 mb-3 uppercase text-xs text-slate-400 tracking-wider">Earnings (Days: {salary.daysInMonth})</h4>
                        <div className="space-y-3 text-sm">
                            <PayRow label="Basic Salary" value={salary.basic} />
                            <PayRow label="HRA" value={salary.hra} />
                            <PayRow label="DA" value={salary.da} />
                            <PayRow label="Medical Allow." value={salary.medical} />
                            <PayRow label="Special Allow." value={salary.special} />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold border-b border-slate-100 pb-2 mb-3 uppercase text-xs text-slate-400 tracking-wider">Deductions</h4>
                        <div className="space-y-3 text-sm text-red-600">
                            <PayRow label="Provident Fund" value={salary.pfAmount} />
                            <PayRow label="Professional Tax" value={salary.pt} />
                            <PayRow label="LOP Deduction" value={salary.lopAmount} />
                            {salary.totalPermissionHours > 0 && (
                                <div className="flex justify-between items-center group text-slate-500">
                                    <span className="text-xs">Permission Hrs ({salary.totalPermissionHours}h)</span>
                                    <span className="font-mono font-medium text-xs">-</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between items-center mb-8">
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">Net Payable</div>
                    <div className="text-2xl font-bold text-slate-900">{formatCurrency(salary.net)}</div>
                </div>

                <div className="text-center">
                    <Button onClick={() => window.print()} className="mx-auto print:hidden" icon={<Printer size={16} />}>
                        Print / Save PDF
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

function PayRow({ label, value }) {
    return (
        <div className="flex justify-between items-center group">
            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
            <span className="font-mono font-medium">{formatCurrency(value)}</span>
        </div>
    );
}
