export const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

export const calculateComplexSalary = (baseSalary, pfOpted, bonuses, attendance, leaves, empId, salaryConfig, year, month) => {
    // Config Defaults
    const config = salaryConfig || { daPercent: 10, specialAllowance: 0, medicalAllowance: 1200 };

    // Dynamic Days in Month (default to current if not provided, but mostly provided)
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month !== undefined ? month : new Date().getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);

    // Components
    const basic = baseSalary;
    const hra = basic * 0.40; // Fixed 40% HRA standard
    const da = basic * (config.daPercent / 100);
    const medical = Number(config.medicalAllowance) || 0;
    const special = Number(config.specialAllowance) || 0;

    const grossEarning = basic + hra + da + medical + special;

    // New Logic: Per Day is based on specific month
    const perDay = grossEarning / daysInMonth;

    // Deductions Logic
    // 1. Unpaid Leaves (Full Day)
    const unpaidLeaves = leaves.filter(l => l.empId === empId && l.status === 'Approved' && l.type === 'Unpaid Leave').length;
    // 2. Absents (filtered by month/year matching ideally, but assuming 'attendance' passed is for this month)
    const absents = attendance.filter(a => a.empId === empId && a.status === 'Absent').length;
    // 3. Half Days (Approved)
    const halfDays = leaves.filter(l => l.empId === empId && l.status === 'Approved' && l.type === 'Half Day').length;

    // 4. Permissions (Just tracking total hours)
    const permissionRecords = attendance.filter(a => a.empId === empId && a.status === 'Permission');
    const totalPermissionHours = permissionRecords.reduce((acc, curr) => acc + (curr.permissionHours || 0), 0);

    // Total Deductible Days
    // Note: Half Day = 0.5 deduction
    const totalDeductionDays = absents + unpaidLeaves + (halfDays * 0.5);
    const lopAmount = totalDeductionDays * perDay;

    const pfAmount = pfOpted ? (basic * 0.12) : 0;
    const pt = 200; // Professional Tax 

    const bonusAmount = bonuses?.reduce((a, b) => a + b.amount, 0) || 0;

    const totalDeductions = lopAmount + pfAmount + pt;
    const net = grossEarning + bonusAmount - totalDeductions;

    return {
        basic, hra, da, medical, special,
        grossEarning,
        perDay,
        daysInMonth,
        activeLeaves: unpaidLeaves,
        halfDays,
        absents,
        totalPermissionHours,
        lopAmount,
        pfAmount, pt,
        bonusAmount,
        totalDeductions,
        net
    };
};
