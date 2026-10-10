import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function LeaveManager({ employees, leaves, onUpdateStatus }) {
    const updateStatus = (id, status) => {
        onUpdateStatus(id, status);
    };

    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    const historyLeaves = leaves.filter(l => l.status !== 'Pending').sort((a, b) => b.id - a.id);

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Leave & Permission Requests</h2>

            {/* Pending Section */}
            <div>
                <h3 className="font-bold text-lg mb-4 text-orange-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    Pending Approvals
                </h3>
                {pendingLeaves.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                        No pending requests. All caught up!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingLeaves.map(l => (
                            <LeaveCard
                                key={l.id}
                                leave={l}
                                employee={employees.find(e => e.id === l.empId)}
                                onApprove={() => updateStatus(l.id, 'Approved')}
                                onReject={() => updateStatus(l.id, 'Rejected')}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* History Section */}
            {historyLeaves.length > 0 && (
                <div>
                    <h3 className="font-bold text-lg mb-4 text-slate-600">Past Requests History</h3>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 max-h-[500px] overflow-y-auto space-y-3">
                        {historyLeaves.map(l => (
                            <LeaveRow
                                key={l.id}
                                leave={l}
                                employee={employees.find(e => e.id === l.empId)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function LeaveCard({ leave, employee, onApprove, onReject }) {
    return (
        <Card className="flex flex-col sm:flex-row justify-between gap-4 !p-5 border-l-4 border-l-orange-400">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-lg">{employee?.name || 'Unknown Employee'}</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-medium">{employee?.department}</span>
                </div>

                <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{leave.type}</span>
                        <span className="text-slate-500">for</span>
                        <span className="font-medium text-slate-800">{leave.type === 'Permission (Hours)' ? `${leave.dates} Hours` : leave.dates}</span>
                    </div>
                    <div className="text-slate-500 italic">"{leave.reason}"</div>
                </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
                <Button size="sm" className="!bg-green-600 hover:!bg-green-700" onClick={onApprove}>Approve</Button>
                <Button size="sm" variant="danger" onClick={onReject}>Reject</Button>
            </div>
        </Card>
    );
}

function LeaveRow({ leave, employee }) {
    const isApproved = leave.status === 'Approved';
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-100 flex justify-between items-center shadow-sm opacity-75 hover:opacity-100 transition-opacity">
            <div>
                <div className="font-bold text-sm text-slate-700">{employee?.name}</div>
                <div className="text-xs text-slate-500">
                    <span className="font-medium">{leave.type}</span> • {leave.dates}
                </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {leave.status}
            </span>
        </div>
    );
}
