import React, { useState } from 'react';
import { Plus, Ban } from 'lucide-react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { formatCurrency } from '../../../utils/helpers';
import EmployeeFormModal from './EmployeeFormModal';
import ServiceRecordModal from '../shared/ServiceRecordModal';

export default function EmployeeDirectory({ employees, onAdd, onUpdate, onTerminate }) {
    const [editing, setEditing] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [viewRecord, setViewRecord] = useState(null);

    const handleSave = (emp) => {
        if (isNew) {
            onAdd({
                ...emp,
                // Server handles ID
                bonuses: [],
                status: 'Active',
                password: '123', // Default password
                salaryConfig: emp.salaryConfig || { daPercent: 10, specialAllowance: 0, medicalAllowance: 1200 }
            });
        } else {
            onUpdate(emp.id, emp);
        }
        setEditing(null);
    };

    const handleTerminate = (emp) => {
        if (confirm(`Are you sure you want to terminate ${emp.name}?`)) {
            const reason = prompt("Please enter a reason for termination:", "Administrative Action");
            if (reason) {
                onTerminate(emp.id, reason);
            }
        }
    };

    const handleAddNew = () => {
        setEditing({
            pfOpted: false,
            salary: 0,
            salaryConfig: { daPercent: 10, specialAllowance: 0, medicalAllowance: 1200 }
        });
        setIsNew(true);
    };

    const activeEmps = employees.filter(e => e.status !== 'Terminated');
    const terminatedEmps = employees.filter(e => e.status === 'Terminated');

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Employee Directory</h2>
                    <p className="text-slate-500 text-sm">Manage your salary configurations</p>
                </div>
                <Button onClick={handleAddNew} icon={<Plus size={18} />}>Add Employee</Button>
            </div>

            {/* Active List */}
            <div>
                <h3 className="font-bold text-lg mb-4 text-slate-700 border-l-4 border-indigo-600 pl-3">Active Employees</h3>
                <Card padding="p-0">
                    <div className="divide-y divide-slate-100">
                        {activeEmps.map(e => (
                            <div key={e.id} className="flex flex-col sm:flex-row justify-between p-4 hover:bg-slate-50 transition-colors gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl border-2 border-white shadow-sm">
                                        {e.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">{e.name}</div>
                                        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2 py-0.5 rounded-full w-fit mt-0.5">
                                            {e.role}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">{e.department} • {e.phone}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 sm:justify-end">
                                    <div className="text-right hidden sm:block">
                                        <div className="font-mono text-slate-700 font-medium">{formatCurrency(e.salary)}</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Base Pay</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => { setEditing(e); setIsNew(false); }}>
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => handleTerminate(e)}>
                                            <Ban size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {activeEmps.length === 0 && (
                            <div className="p-8 text-center text-slate-400">
                                <p>No active employees found.</p>
                                <p className="text-sm mt-2 text-slate-400">
                                    If you expected data here, <strong>your server might be down</strong>.
                                    <br />
                                    Check your terminal or <button onClick={() => window.location.reload()} className="text-indigo-600 hover:underline">Refresh Page</button>.
                                </p>
                                <p className="text-xs mt-4">Otherwise, click "Add Employee" to get started.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Terminated List */}
            {terminatedEmps.length > 0 && (
                <div>
                    <h3 className="font-bold text-lg mb-4 text-red-700 border-l-4 border-red-600 pl-3">Terminated / Ex-Employees</h3>
                    <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 divide-y divide-red-100">
                        {terminatedEmps.map(e => (
                            <div key={e.id} className="flex justify-between items-center p-4">
                                <div>
                                    <div className="font-bold text-red-900">{e.name}</div>
                                    <div className="text-xs text-red-700 mt-0.5">
                                        Terminated on: {new Date(e.terminationDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="!bg-white !text-red-600 !border-red-200 hover:!bg-red-50"
                                    onClick={() => setViewRecord(e)}
                                >
                                    View Service Record
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <EmployeeFormModal
                isOpen={!!editing}
                employee={editing}
                onClose={() => setEditing(null)}
                onSave={handleSave}
            />

            <ServiceRecordModal
                employee={viewRecord}
                onClose={() => setViewRecord(null)}
            />
        </div>
    );
}
