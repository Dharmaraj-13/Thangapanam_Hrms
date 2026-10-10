import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { getDaysInMonth } from '../../../utils/helpers';
import Card from '../../ui/Card';

export default function MyAttendance({ empId, attendance, holidays = [], holidayConfig = { treatSundaysAsHolidays: true } }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const getStatusRecord = (day) => {
        const d = new Date(year, month, day);
        const dateStr = d.toISOString().split('T')[0];
        return attendance.find(a => a.empId === empId && a.date === dateStr);
    };

    const isHoliday = (day) => {
        const d = new Date(year, month, day);
        const dateStr = d.toISOString().split('T')[0];
        return holidays.find(h => h.date === dateStr);
    };

    const isSunday = (day) => {
        const d = new Date(year, month, day);
        return d.getDay() === 0;
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    return (
        <Card className="animate-fade-in" padding="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-xl font-bold text-slate-800">My Attendance</h2>
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

            <div className="grid grid-cols-7 gap-3 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">{d}</div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const record = getStatusRecord(d);
                    const status = record?.status;
                    const holiday = isHoliday(d);
                    const sunday = isSunday(d);

                    let styles = "bg-white border-slate-100 text-slate-300";
                    let content = d;

                    if (holiday) {
                        styles = "bg-purple-50 border-purple-200 text-purple-700 font-bold";
                        // content = "H"; // Keep date but maybe add tooltip
                    } else if (sunday && holidayConfig.treatSundaysAsHolidays) {
                        styles = "bg-orange-50 border-orange-200 text-orange-700";
                    }

                    if (status === 'Present') styles = "bg-green-50 border-green-200 text-green-700 shadow-sm font-bold";
                    if (status === 'Absent') styles = "bg-red-50 border-red-200 text-red-700 shadow-sm font-bold";
                    if (status === 'Permission') {
                        styles = "bg-yellow-50 border-yellow-200 text-yellow-700 shadow-sm font-bold";
                        content = (
                            <div className="flex flex-col items-center leading-none">
                                <span>{d}</span>
                                <span className="text-[9px] mt-0.5">{record.permissionHours}h</span>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={d}
                            className={`aspect-square rounded-xl flex items-center justify-center text-sm border transition-all ${styles} hover:scale-105`}
                            title={`Day ${d}: ${status || (holiday ? holiday.name : (sunday ? 'Sunday' : 'Not Marked'))}`}
                        >
                            {content}
                        </div>
                    )
                })}
            </div>

            <div className="flex gap-6 justify-center text-xs font-medium text-slate-500 mt-6 border-t pt-4">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Present</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Permission</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Holiday</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-200"></div> Not Marked</div>
            </div>
        </Card>
    );
}
