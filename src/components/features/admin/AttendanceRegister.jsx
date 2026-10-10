import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Card from '../../ui/Card';
import { getDaysInMonth } from '../../../utils/helpers';

export default function AttendanceRegister({ employees, attendance, onAddAttendance }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Filter mainly for active employees but we might want to see history for terminated too?
    // Following old logic: Admin passed activeEmployees

    const getStatusRecord = (empId, day) => {
        const d = new Date(year, month, day);
        const dateStr = d.toLocaleDateString('en-CA');
        return attendance.find(a => a.employeeId === empId && a.date === dateStr);
    };

    const toggleStatus = (empId, day) => {
        const d = new Date(year, month, day);
        // Correct date format for local time to avoid timezone shifts if simple ISO string
        // But for simplicity sticking to YYYY-MM-DD
        const dateStr = d.toLocaleDateString('en-CA');
        const current = attendance.find(a => a.employeeId === empId && a.date === dateStr);

        // Cycle: Present -> Absent -> Permission -> Present
        let newStatus = 'Present';
        let permissionHours = 0;

        if (!current || current.status === 'Present') {
            newStatus = 'Absent';
        } else if (current.status === 'Absent') {
            newStatus = 'Permission';
            const hours = prompt("Enter Permission Hours (e.g., 2):", "2");
            if (hours === null) return;
            permissionHours = parseFloat(hours) || 0;
            if (permissionHours === 0) newStatus = 'Present';
        } else if (current.status === 'Permission') {
            newStatus = 'Present';
        }

        onAddAttendance({ employeeId: empId, date: dateStr, status: newStatus, permissionHours });
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    return (
        <Card className="animate-fade-in" padding="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Attendance Register</h2>
                <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                    <button onClick={() => changeMonth(-1)} className="text-slate-500 hover:text-indigo-600 p-1 rounded-full hover:bg-white transition-all shadow-sm">
                        <ChevronRight className="rotate-180" size={20} />
                    </button>
                    <span className="font-bold w-32 text-center text-slate-700 select-none">{monthName}</span>
                    <button onClick={() => changeMonth(1)} className="text-slate-500 hover:text-indigo-600 p-1 rounded-full hover:bg-white transition-all shadow-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 border-b border-r border-slate-200 bg-slate-50 sticky left-0 z-10 w-48 font-bold text-slate-600">Employee</th>
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                                <th key={d} className="border-b border-l border-slate-100 text-center min-w-[36px] text-xs text-slate-500 font-medium bg-slate-50 py-2">
                                    {d}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3 border-r border-slate-200 font-medium text-slate-700 sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    {emp.name}
                                </td>
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                                    const record = getStatusRecord(emp.id, d);
                                    const status = record?.status;
                                    let statusColor = "bg-slate-100";
                                    let content = "";

                                    if (status === 'Present') statusColor = "bg-green-500 shadow-sm";
                                    if (status === 'Absent') statusColor = "bg-red-500 shadow-sm";
                                    if (status === 'Permission') {
                                        statusColor = "bg-yellow-400 shadow-sm";
                                        content = record.permissionHours + 'h';
                                    }

                                    return (
                                        <td
                                            key={d}
                                            className="border-b border-l border-slate-100 text-center p-1 cursor-pointer hover:bg-slate-100 transition-colors"
                                            onClick={() => toggleStatus(emp.id, d)}
                                            title={status ? `${status} ${status === 'Permission' ? `(${record.permissionHours}h)` : ''}` : 'Not Marked'}
                                        >
                                            <div className={`w-3 h-3 rounded-full mx-auto transition-all duration-200 ${statusColor} flex items-center justify-center text-[8px] font-bold text-white`}>
                                                {content}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Present</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Absent</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400 text-[8px] flex items-center justify-center text-white font-bold">2h</div> Permission</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></div> Not Marked</div>
            </div>
        </Card>
    );
}
