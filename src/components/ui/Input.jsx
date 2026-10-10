import React from 'react';

export default function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    className = '',
    required = false,
    ...props
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-0.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                {...props}
            />
        </div>
    );
}
