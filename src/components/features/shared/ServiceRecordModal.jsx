import React from 'react';
import { FileText } from 'lucide-react';
import Modal from '../../ui/Modal';

export default function ServiceRecordModal({ employee, onClose }) {
    if (!employee) return null;

    return (
        <Modal isOpen={!!employee} onClose={onClose} title="Service Record" maxWidth="max-w-3xl">
            <div className="relative min-h-[600px] flex flex-col">
                <div className="absolute top-[-24px] left-[-24px] w-[calc(100%+48px)] h-2 bg-red-600 rounded-t-xl"></div>
                <div className="text-center mb-8 mt-2">
                    <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-widest">Service Record</h1>
                    <p className="text-slate-500 italic">Confidential Personnel File</p>
                </div>

                <div className="flex gap-8 mb-8">
                    <div className="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center border-2 border-slate-300 border-dashed text-slate-400 text-xs font-medium">
                        NO PHOTO
                    </div>
                    <div className="flex-1 space-y-3">
                        <RecordRow label="Full Name" value={employee.name} />
                        <RecordRow label="Employee ID" value={`EMP-${employee.id}`} />
                        <RecordRow label="Designation" value={employee.role} />
                        <RecordRow label="Department" value={employee.department} />
                        <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
                            <span className="font-bold text-slate-500 text-sm uppercase">Status</span>
                            <span className="text-red-600 font-bold uppercase">{employee.status}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-6 flex-1">
                    <h4 className="font-bold text-slate-700 mb-4 uppercase text-sm border-b pb-2">Termination Details</h4>
                    <p className="mb-2 text-sm"><span className="font-bold text-slate-600">Date of Termination:</span> {employee.terminationDate ? new Date(employee.terminationDate).toLocaleDateString() : 'N/A'}</p>
                    <p className="mb-2 text-sm"><span className="font-bold text-slate-600">Reason:</span> {employee.terminationReason || 'Admin Action'}</p>
                    <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                        This document serves as the full and final settlement record for the above mentioned employee.
                        All access to company portals and proprietary information has been revoked effective immediately.
                    </p>
                </div>

                <div className="text-center mt-auto">
                    <button
                        onClick={() => window.print()}
                        className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-black print:hidden flex items-center justify-center gap-2 mx-auto transition-colors"
                    >
                        <FileText size={16} /> Print to PDF
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function RecordRow({ label, value }) {
    return (
        <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-500 text-sm uppercase">{label}</span>
            <span className="text-slate-900 font-medium">{value}</span>
        </div>
    );
}
