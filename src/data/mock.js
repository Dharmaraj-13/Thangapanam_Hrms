export const INITIAL_EMPLOYEES = [
    {
        id: 1,
        name: 'Anita Kumar',
        role: 'Data Analyst',
        department: 'Analytics',
        salary: 45000,
        pfOpted: true,
        bonuses: [],
        password: '123',
        status: 'Active',
        // New Profile Fields
        address: '123, Tech Park Road, Bangalore',
        phone: '9876543210',
        email: 'anita@example.com',
        joiningDate: '2023-01-15',
        // Custom Salary Config
        salaryConfig: {
            daPercent: 10,
            specialAllowance: 2000,
            medicalAllowance: 1200
        }
    },
    {
        id: 2,
        name: 'Ramesh Iyer',
        role: 'Frontend Dev',
        department: 'Engineering',
        salary: 55000,
        pfOpted: false,
        bonuses: [],
        password: '123',
        status: 'Active',
        address: '45/B, Green Garden, Chennai',
        phone: '9123456789',
        email: 'ramesh@example.com',
        joiningDate: '2023-03-10',
        salaryConfig: {
            daPercent: 12,
            specialAllowance: 2500,
            medicalAllowance: 1200
        }
    },
    {
        id: 3,
        name: 'Priya Raj',
        role: 'Product Manager',
        department: 'Product',
        salary: 85000,
        pfOpted: true,
        bonuses: [],
        password: '123',
        status: 'Active',
        address: '789, Lake View, Hyderabad',
        phone: '9988776655',
        email: 'priya@example.com',
        joiningDate: '2022-11-01',
        salaryConfig: {
            daPercent: 15,
            specialAllowance: 5000,
            medicalAllowance: 1200
        }
    }
];

export const INITIAL_ANNOUNCEMENTS = [
    { id: 1, message: 'Welcome to the new HR Portal! Please check your profile details.', date: '2023-10-25', type: 'Info' },
    { id: 2, message: 'Diwali Holiday on Nov 12th.', date: '2023-11-01', type: 'Alert' }
];

export const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Unpaid Leave', 'Half Day', 'Permission (Hours)'];

export const INITIAL_HOLIDAYS = [
    { date: '2023-11-12', name: 'Diwali', type: 'Floating' },
    { date: '2023-12-25', name: 'Christmas', type: 'Mandatory' }
];

export const HOLIDAY_CONFIG = {
    treatSundaysAsHolidays: true
};
