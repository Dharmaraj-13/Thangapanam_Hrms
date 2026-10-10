CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    department VARCHAR(100),
    salary NUMERIC(10, 2),
    pf_opted BOOLEAN DEFAULT false,
    password VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    joining_date DATE,
    salary_config JSONB,
    bonuses JSONB DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    employee_id INTEGER REFERENCES employees(id),
    status VARCHAR(50),
    check_in TIME,
    check_out TIME,
    hours_worked NUMERIC(5, 2),
    overtime NUMERIC(5, 2)
);

CREATE TABLE IF NOT EXISTS leaves (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    type VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS holidays (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB
);
