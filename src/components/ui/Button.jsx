import React from 'react';

export default function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    type = 'button'
}) {
    const baseStyles = "flex items-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
        danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
        ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-sm"
    };

    const sizes = {
        sm: "px-2 py-1 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
            {children}
        </button>
    );
}
