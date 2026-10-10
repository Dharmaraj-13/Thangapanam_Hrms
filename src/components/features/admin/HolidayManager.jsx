import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Calendar, Trash2, Plus } from 'lucide-react';
import { getDaysInMonth } from '../../../utils/helpers';

export default function HolidayManager({ holidays, onAdd, onDelete, config, onUpdateConfig }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [newHolidayName, setNewHolidayName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const handleAddHoliday = (e) => {
        e.preventDefault();
        if (!selectedDate || !newHolidayName) return;

        // Prevent duplicate
        if (holidays.some(h => h.date === selectedDate)) {
            alert('A holiday already exists on this date.');
            return;
        }

        onAdd({ date: selectedDate, name: newHolidayName, type: 'Manual' });
        setNewHolidayName('');
        setSelectedDate('');
    };

    const handleDeleteHoliday = (date) => {
        const hol = holidays.find(h => h.date === date);
        if (hol) onDelete(hol.id);
    };

    const isHoliday = (day) => {
        const d = new Date(year, month, day);
        const dateStr = d.toLocaleDateString('en-CA');
        return holidays.find(h => h.date === dateStr);
    };

    const isSunday = (day) => {
        const d = new Date(year, month, day);
        return d.getDay() === 0;
    };

    return (
        <Card className="animate-fade-in" padding="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Holiday Management</h2>
                    <p className="text-sm text-slate-500">Configure factory holidays and weekly offs</p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg">
                    <input
                        type="checkbox"
                        id="sundayToggle"
                        checked={config.treatSundaysAsHolidays}
                        onChange={(e) => onUpdateConfig({ ...config, treatSundaysAsHolidays: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="sundayToggle" className="text-sm font-medium text-indigo-900 cursor-pointer select-none">
                        Treat Sundays as Holidays
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Holiday Form */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <Plus size={18} /> Add New Holiday
                        </h3>
                        <form onSubmit={handleAddHoliday} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={e => setSelectedDate(e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Holiday Name</label>
                                <input
                                    type="text"
                                    value={newHolidayName}
                                    onChange={e => setNewHolidayName(e.target.value)}
                                    placeholder="e.g. Independence Day"
                                    className="w-full text-sm border-slate-200 rounded-lg"
                                    required
                                />
                            </div>
                            <Button type="submit" variant="primary" className="w-full">Add Holiday</Button>
                        </form>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider">
                            Upcoming Holidays
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {holidays.sort((a, b) => new Date(a.date) - new Date(b.date)).map((h, i) => (
                                <div key={i} className="p-3 border-b border-slate-100 last:border-0 flex justify-between items-center group hover:bg-slate-50">
                                    <div>
                                        <div className="font-medium text-slate-800 text-sm">{h.name}</div>
                                        <div className="text-xs text-slate-400">{h.date}</div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteHoliday(h.date)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {holidays.length === 0 && (
                                <div className="p-4 text-center text-sm text-slate-400 italic">No holidays configured</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="lg:col-span-2 border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
                        <span className="font-bold text-slate-700">{monthName}</span>
                        {/* Simple Month Nav (reuse logic if needed, simplify for now) */}
                        <div className="text-xs text-slate-400">Current Month View</div>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {/* Blank cells for start of month would be good, but simple map for now */}
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                                const holiday = isHoliday(d);
                                const sunday = isSunday(d);
                                let bg = "bg-white";
                                let text = "text-slate-600";
                                let border = "border-slate-100";

                                if (holiday) {
                                    bg = "bg-purple-50";
                                    text = "text-purple-700 font-bold";
                                    border = "border-purple-200";
                                } else if (sunday && config.treatSundaysAsHolidays) {
                                    bg = "bg-orange-50";
                                    text = "text-orange-700";
                                    border = "border-orange-200";
                                }

                                return (
                                    <div key={d} className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 text-center transition-all hover:shadow-md ${bg} ${border} ${text}`}>
                                        <span className="text-sm">{d}</span>
                                        {holiday && <span className="text-[10px] leading-tight mt-1 line-clamp-2">{holiday.name}</span>}
                                        {sunday && !holiday && config.treatSundaysAsHolidays && <span className="text-[10px] mt-1">Sun</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
