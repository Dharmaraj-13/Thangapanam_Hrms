import React from 'react';

export default function Card({ children, className = '', padding = 'p-6' }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${padding} ${className}`}>
            {children}
        </div>
    );
}
