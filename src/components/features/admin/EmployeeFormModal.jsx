import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

export default function EmployeeFormModal({ employee, isOpen, onClose, onSave }) {
    const [form, setForm] = useState(employee || {});

    // Update form when employee prop changes
    useEffect(() => {
        if (employee) {
            setForm(employee);
        }
    }, [employee]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleConfigChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            salaryConfig: {
                ...prev.salaryConfig,
                [field]: Number(value)
            }
        }));
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={employee.id ? "Edit Employee" : "New Employee"}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Info</h4>
                        <div className="space-y-3">
                            <Input label="Full Name" value={form.name || ''} onChange={e => handleChange('name', e.target.value)} placeholder="John Doe" />
                            <Input label="Role" value={form.role || ''} onChange={e => handleChange('role', e.target.value)} placeholder="Software Engineer" />
                            <Input label="Department" value={form.department || ''} onChange={e => handleChange('department', e.target.value)} placeholder="Engineering" />
                            <Input label="Phone" value={form.phone || ''} onChange={e => handleChange('phone', e.target.value)} placeholder="+1 234 567 890" />
                            <Input label="Email" type="email" value={form.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="john@example.com" />
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-0.5">Address</label>
                                <textarea
                                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                                    rows="2"
                                    value={form.address || ''}
                                    onChange={e => handleChange('address', e.target.value)}
                                    placeholder="123 Main St..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Salary Config */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Compensation & Benefits</h4>
                        <div className="space-y-4">
                            <Input label="Basic Salary (Monthly)" type="number" value={form.salary || ''} onChange={e => handleChange('salary', Number(e.target.value))} />

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="DA %" type="number" value={form.salaryConfig?.daPercent || 0} onChange={e => handleConfigChange('daPercent', e.target.value)} />
                                <Input label="Special Allow." type="number" value={form.salaryConfig?.specialAllowance || 0} onChange={e => handleConfigChange('specialAllowance', e.target.value)} />
                            </div>

                            <Input label="Medical Allow." type="number" value={form.salaryConfig?.medicalAllowance || 0} onChange={e => handleConfigChange('medicalAllowance', e.target.value)} />

                            <div className="pt-4">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                        checked={form.pfOpted || false}
                                        onChange={e => handleChange('pfOpted', e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-slate-700">Enable Provident Fund (PF)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onSave(form)}>Save Configuration</Button>
                </div>
            </div>
        </Modal>
    );
}
