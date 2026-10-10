import React, { useState, useMemo, useEffect } from 'react';
import EmployeeLayout from '../components/layout/EmployeeLayout';
import DashboardSummary from '../components/features/employee/DashboardSummary';
import MyAttendance from '../components/features/employee/MyAttendance';
import MyLeaves from '../components/features/employee/MyLeaves';
import Profile from '../components/features/employee/Profile';
import PayslipModal from '../components/features/shared/PayslipModal';
import { calculateComplexSalary } from '../utils/helpers';

export default function EmployeeDashboard({ user, onLogout, data, actions }) {
    const [activeTab, setActiveTab] = useState('summary');
    const [showPayslip, setShowPayslip] = useState(false);
    const [welcomeMsg, setWelcomeMsg] = useState('');
    const empId = user.data.id;

    const salaryDetails = useMemo(() => {
        return calculateComplexSalary(user.data.salary, user.data.pfOpted, user.data.bonuses, data.attendance, data.leaves, empId, user.data.salaryConfig);
    }, [user.data, data.attendance, data.leaves, empId]);

    useEffect(() => {
        // Random Welcome Message
        const messages = [
            "u r looking awsome today",
            "Have a productive day!",
            "Great to see you again!",
            "Welcome back to Thangapanam!",
            "Let's achieve great things today!",
            "Your dedication makes a difference!"
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setWelcomeMsg(randomMsg);

        const timer = setTimeout(() => setWelcomeMsg(''), 5000);
        return () => clearTimeout(timer);
    }, []);

    const renderTab = () => {
        switch (activeTab) {
            case 'summary':
                return <DashboardSummary salary={salaryDetails} emp={user.data} announcements={data.announcements} onShowPayslip={() => setShowPayslip(true)} />;
            case 'attendance':
                return <MyAttendance empId={empId} attendance={data.attendance} />;
            case 'leaves':
                return <MyLeaves empId={empId} leaves={data.leaves} onAdd={actions.addLeave} empName={user.data.name} />;
            case 'profile':
                return <Profile emp={user.data} />;
            default: return null;
        }
    };

    return (
        <EmployeeLayout user={user.data} activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout}>
            {welcomeMsg && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce border border-indigo-100 flex items-center gap-2">
                    <span className="text-xl">👋</span>
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        {welcomeMsg}
                    </span>
                </div>
            )}
            {renderTab()}
            <PayslipModal isOpen={showPayslip} onClose={() => setShowPayslip(false)} salary={salaryDetails} emp={user.data} />
        </EmployeeLayout>
    );
}
