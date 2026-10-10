import React, { useState } from 'react';
import { Mail, Clock, User, Plus } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { LEAVE_TYPES } from '../../../data/mock';

export default function MyLeaves({ empId, leaves, onAdd, empName }) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ type: LEAVE_TYPES[0], dates: '', reason: '' });

    const myLeaves = leaves.filter(l => l.empId === empId).sort((a, b) => b.id - a.id);

    const request = (e) => {
        e.preventDefault();
        onAdd({ empId, ...form, status: 'Pending' });

        // Mailto Logic
        const subject = `Request: ${form.type} - ${empName}`;
        let body = `Dear Admin,%0D%0A%0D%0AI would like to request ${form.type}.%0D%0ADetails/Dates: ${form.dates}.%0D%0AReason: ${form.reason}.%0D%0A%0D%0ARegards,%0D%0A${empName}`;

        // Just opening it without navigation redirect to avoid breaking SPA flow if possible, but window.location is standard for mailto
        window.location.href = `mailto:admin@company.com?subject=${subject}&body=${body}`;

        setShowForm(false);
        setForm({ type: LEAVE_TYPES[0], dates: '', reason: '' });
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl text-slate-800">Leave Requests</h3>
                <Button onClick={() => setShowForm(!showForm)} icon={showForm ? null : <Plus size={16} />}>
                    {showForm ? 'Cancel Request' : 'New Request'}
                </Button>
            </div>

            {showForm && (
                <Card className="bg-slate-50 !border-slate-200 animate-scale-in">
                    <h4 className="font-bold mb-6 text-slate-700 border-b pb-2">Submit Request</h4>
                    <form onSubmit={request} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 font-bold uppercase mb-1.5 ml-0.5 block">Request Type</label>
                                <select
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                                >
                                    {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <Input
                                label={form.type === 'Permission (Hours)' ? 'Number of Hours' : 'Dates'}
                                type={form.type === 'Permission (Hours)' ? 'number' : 'text'}
                                placeholder={form.type === 'Permission (Hours)' ? 'e.g. 2' : 'e.g. 2023-10-25'}
                                required
                                value={form.dates}
                                onChange={e => setForm({ ...form, dates: e.target.value })}
                            />
                        </div>
                        <Input
                            label="Reason"
                            placeholder="Reason for request..."
                            required
                            value={form.reason}
                            onChange={e => setForm({ ...form, reason: e.target.value })}
                        />
                        <div className="flex justify-end pt-2">
                            <Button type="submit" icon={<Mail size={16} />}>Submit Request</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="space-y-4">
                {myLeaves.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-400 italic">No request history found.</p>
                    </div>
                ) : myLeaves.map(l => (
                    <Card key={l.id} padding="p-5" className="flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={`p-3 rounded-full shrink-0 ${l.type.includes('Permission') ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-indigo-600'}`}>
                                {l.type.includes('Permission') ? <Clock size={20} /> : <User size={20} />}
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 text-base">{l.type}</div>
                                <div className="text-sm text-slate-500 mt-0.5 max-w-md">
                                    <span className="font-medium text-slate-900">{l.type === 'Permission (Hours)' ? `${l.dates} Hours` : l.dates}</span>
                                    <span className="mx-2 text-slate-300">|</span>
                                    <span className="italic">"{l.reason}"</span>
                                </div>
                            </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-full md:w-auto text-center ${l.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            l.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                            {l.status}
                        </span>
                    </Card>
                ))}
            </div>
        </div>
    );
}
