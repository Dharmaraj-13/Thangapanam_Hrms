import express from 'express';
import cors from 'cors';
import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database Schema and Seed Data
const initDB = async () => {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await db.query(schema);
        console.log('Database schema initialized.');

        // Check if employees exist, if not seed
        const res = await db.query('SELECT count(*) FROM employees');
        if (parseInt(res.rows[0].count) === 0) {
            console.log('Seeding initial data...');

            // Seed Employees
            const employees = [
                {
                    name: 'Anita Kumar', role: 'Data Analyst', department: 'Analytics', salary: 45000,
                    pf_opted: true, password: '123', status: 'Active',
                    address: '123, Tech Park Road, Bangalore', phone: '9876543210', email: 'anita@example.com', joining_date: '2023-01-15',
                    salary_config: { daPercent: 10, specialAllowance: 2000, medicalAllowance: 1200 }
                },
                {
                    name: 'Ramesh Iyer', role: 'Frontend Dev', department: 'Engineering', salary: 55000,
                    pf_opted: false, password: '123', status: 'Active',
                    address: '45/B, Green Garden, Chennai', phone: '9123456789', email: 'ramesh@example.com', joining_date: '2023-03-10',
                    salary_config: { daPercent: 12, specialAllowance: 2500, medicalAllowance: 1200 }
                },
                {
                    name: 'Priya Raj', role: 'Product Manager', department: 'Product', salary: 85000,
                    pf_opted: true, password: '123', status: 'Active',
                    address: '789, Lake View, Hyderabad', phone: '9988776655', email: 'priya@example.com', joining_date: '2022-11-01',
                    salary_config: { daPercent: 15, specialAllowance: 5000, medicalAllowance: 1200 }
                }
            ];

            for (const emp of employees) {
                await db.query(
                    `INSERT INTO employees (name, role, department, salary, pf_opted, password, status, address, phone, email, joining_date, salary_config) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                    [emp.name, emp.role, emp.department, emp.salary, emp.pf_opted, emp.password, emp.status, emp.address, emp.phone, emp.email, emp.joining_date, emp.salary_config]
                );
            }

            // Seed Holidays
            await db.query("INSERT INTO holidays (date, name, type) VALUES ('2023-11-12', 'Diwali', 'Floating'), ('2023-12-25', 'Christmas', 'Mandatory')");

            // Seed Announcements
            await db.query("INSERT INTO announcements (message, date, type) VALUES ('Welcome to the new HR Portal! Please check your profile details.', '2023-10-25', 'Info'), ('Diwali Holiday on Nov 12th.', '2023-11-01', 'Alert')");

            // Seed Settings
            await db.query("INSERT INTO settings (key, value) VALUES ('holidayConfig', $1)", [{ treatSundaysAsHolidays: true }]);

            console.log('Seeding completed.');
        }

    } catch (err) {
        console.error('Error initializing database', err);
    }
};

initDB();

// --- Routes ---

// Employees
app.get('/api/employees', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM employees ORDER BY id');
        // Map back to frontend structure if needed (snake_case -> camelCase is handled in frontend service or here)
        // For simplicity, we are returning DB rows. Frontend might need adjustment for casing.
        const mapped = result.rows.map(e => ({
            ...e,
            pfOpted: e.pf_opted,
            joiningDate: e.joining_date,
            salaryConfig: e.salary_config,
            // bonuses handled automatically
        }));
        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/employees', async (req, res) => {
    const { name, role, department, salary, pfOpted, password, status, address, phone, email, joiningDate, salaryConfig } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO employees (name, role, department, salary, pf_opted, password, status, address, phone, email, joining_date, salary_config) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [name, role, department, salary, pfOpted, password, status || 'Active', address, phone, email, joiningDate, salaryConfig]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    // Dynamic Update
    const fields = [];
    const values = [];
    let idx = 1;

    // Mapping frontend keys to DB columns
    const keyMap = {
        name: 'name', role: 'role', department: 'department', salary: 'salary', pfOpted: 'pf_opted',
        password: 'password', status: 'status', address: 'address', phone: 'phone', email: 'email',
        joiningDate: 'joining_date', salaryConfig: 'salary_config', bonuses: 'bonuses'
    };

    for (const key in body) {
        if (keyMap[key]) {
            fields.push(`${keyMap[key]} = $${idx++}`);
            values.push(body[key]);
        }
    }
    values.push(id);

    try {
        const result = await db.query(`UPDATE employees SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM employees WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Attendance
app.get('/api/attendance', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM attendance ORDER BY date DESC');
        const mapped = result.rows.map(a => ({
            ...a,
            employeeId: a.employee_id,
            checkIn: a.check_in,
            checkOut: a.check_out,
            hoursWorked: a.hours_worked
        }));
        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/attendance', async (req, res) => {
    const { date, employeeId, status, checkIn, checkOut, hoursWorked, overtime } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO attendance (date, employee_id, status, check_in, check_out, hours_worked, overtime) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [date, employeeId, status, checkIn, checkOut, hoursWorked, overtime]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Leaves
app.get('/api/leaves', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM leaves ORDER BY start_date');
        const mapped = result.rows.map(l => ({
            ...l,
            employeeId: l.employee_id,
            startDate: l.start_date,
            endDate: l.end_date
        }));
        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/leaves', async (req, res) => {
    const { employeeId, type, startDate, endDate, reason, status } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO leaves (employee_id, type, start_date, end_date, reason, status) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [employeeId, type, startDate, endDate, reason, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/leaves/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const result = await db.query('UPDATE leaves SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Announcements
app.get('/api/announcements', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM announcements ORDER BY date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/announcements', async (req, res) => {
    const { message, date, type } = req.body;
    try {
        const result = await db.query('INSERT INTO announcements (message, date, type) VALUES ($1, $2, $3) RETURNING *', [message, date, type]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/announcements/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM announcements WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Holidays
app.get('/api/holidays', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM holidays ORDER BY date');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/holidays', async (req, res) => {
    const { date, name, type } = req.body;
    try {
        const result = await db.query('INSERT INTO holidays (date, name, type) VALUES ($1, $2, $3) RETURNING *', [date, name, type]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/holidays/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM holidays WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Settings
app.get('/api/settings', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM settings WHERE key = 'holidayConfig'");
        res.json(result.rows[0] ? result.rows[0].value : {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', async (req, res) => {
    const { treatSundaysAsHolidays } = req.body;
    try {
        // Upsert
        const result = await db.query(`
            INSERT INTO settings (key, value) VALUES ('holidayConfig', $1)
            ON CONFLICT (key) DO UPDATE SET value = $1 RETURNING *
        `, [{ treatSundaysAsHolidays }]);
        res.json(result.rows[0].value);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Serve Static Assets in Production
// ---------------------------------
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
