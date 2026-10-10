import React, { useState } from 'react';
import { Megaphone, Trash2 } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function AnnouncementManager({ announcements, onAdd, onDelete }) {
    const [msg, setMsg] = useState('');

    const post = (e) => {
        e.preventDefault();
        onAdd({ message: msg, date: new Date().toISOString(), type: 'Admin' });
        setMsg('');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Communication Center</h2>

            <Card>
                <form onSubmit={post}>
                    <label className="block text-sm font-bold text-slate-700 mb-2">New Announcement</label>
                    <textarea
                        className="w-full border border-slate-200 p-4 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm min-h-[100px] resize-y"
                        placeholder="Type a clear, concise message for all employees..."
                        required
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end">
                        <Button type="submit" icon={<Megaphone size={16} />}>Post Message</Button>
                    </div>
                </form>
            </Card>

            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-600">Active Announcements</h3>
                {announcements.length === 0 && <p className="text-slate-400 italic">No active announcements.</p>}

                {announcements.map(a => (
                    <div key={a.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex gap-5 group hover:shadow-md transition-shadow">
                        <div className="mt-1 bg-indigo-50 text-indigo-600 p-3 rounded-full h-fit shrink-0">
                            <Megaphone size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-slate-800 text-base">{a.message}</div>
                            <div className="text-xs text-slate-400 mt-2 font-medium">
                                Posted on {new Date(a.date).toLocaleDateString()}
                            </div>
                        </div>
                        <button
                            onClick={() => onDelete(a.id)}
                            className="text-slate-300 hover:text-red-500 h-fit p-2 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete Announcement"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
