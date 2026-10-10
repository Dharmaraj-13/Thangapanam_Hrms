import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import EmployeeDirectory from '../components/features/admin/EmployeeDirectory';
import AttendanceRegister from '../components/features/admin/AttendanceRegister';
import LeaveManager from '../components/features/admin/LeaveManager';
import AnnouncementManager from '../components/features/admin/AnnouncementManager';
import HolidayManager from '../components/features/admin/HolidayManager';

export default function AdminDashboard({ user, onLogout, data, actions }) {
    const [view, setView] = useState('employees');

    // Filter Active Employees for Attendance/Operations
    const activeEmployees = data.employees.filter(e => e.status !== 'Terminated');

    const renderView = () => {
        switch (view) {
            case 'employees':
                return <EmployeeDirectory
                    employees={data.employees}
                    onAdd={actions.addEmployee}
                    onUpdate={actions.updateEmployee}
                    onTerminate={actions.terminateEmployee}
                />;
            case 'attendance':
                return <AttendanceRegister
                    employees={activeEmployees}
                    attendance={data.attendance}
                    onAddAttendance={actions.addAttendance}
                />;
            case 'leaves':
                return <LeaveManager
                    employees={data.employees}
                    leaves={data.leaves}
                    onUpdateStatus={actions.updateLeaveStatus}
                />;
            case 'announcements':
                return <AnnouncementManager
                    announcements={data.announcements}
                    onAdd={actions.addAnnouncement}
                    onDelete={actions.deleteAnnouncement}
                />;
            case 'holidays':
                return <HolidayManager
                    holidays={data.holidays}
                    onAdd={actions.addHoliday}
                    onDelete={actions.deleteHoliday}
                    config={data.holidayConfig}
                    onUpdateConfig={actions.setHolidayConfig}
                />;
            default: return null;
        }
    };

    return (
        <AdminLayout activeView={view} onViewChange={setView} onLogout={onLogout}>
            {renderView()}
        </AdminLayout>
    );
}
