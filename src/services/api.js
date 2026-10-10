import { INITIAL_EMPLOYEES, INITIAL_ANNOUNCEMENTS, INITIAL_HOLIDAYS, HOLIDAY_CONFIG } from '../data/mock';

const API_URL = '/api';

const handleResponse = async (promise, fallback) => {
    try {
        const res = await promise;
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (err) {
        console.warn('API Failed, using fallback:', err);
        return fallback;
    }
};

export const api = {
    // Employees
    getEmployees: () => handleResponse(fetch(`${API_URL}/employees`), INITIAL_EMPLOYEES),
    addEmployee: (emp) => handleResponse(
        fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emp)
        }),
        { ...emp, id: Date.now() } // Temp fallback ID
    ),
    updateEmployee: (id, data) => handleResponse(
        fetch(`${API_URL}/employees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),
        { ...data, id }
    ),
    deleteEmployee: (id) => fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' }).catch(e => console.warn(e)),

    // Attendance
    getAttendance: () => handleResponse(fetch(`${API_URL}/attendance`), []),
    addAttendance: (att) => handleResponse(
        fetch(`${API_URL}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(att)
        }),
        att
    ),

    // Leaves
    getLeaves: () => handleResponse(fetch(`${API_URL}/leaves`), []),
    addLeave: (leave) => handleResponse(
        fetch(`${API_URL}/leaves`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leave)
        }),
        leave
    ),
    updateLeaveStatus: (id, status) => handleResponse(
        fetch(`${API_URL}/leaves/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        }),
        { id, status }
    ),

    // Announcements
    getAnnouncements: () => handleResponse(fetch(`${API_URL}/announcements`), INITIAL_ANNOUNCEMENTS),
    addAnnouncement: (ann) => handleResponse(
        fetch(`${API_URL}/announcements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ann)
        }),
        ann
    ),
    deleteAnnouncement: (id) => fetch(`${API_URL}/announcements/${id}`, { method: 'DELETE' }).catch(e => console.warn(e)),

    // Holidays
    getHolidays: () => handleResponse(fetch(`${API_URL}/holidays`), INITIAL_HOLIDAYS),
    addHoliday: (hol) => handleResponse(
        fetch(`${API_URL}/holidays`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hol)
        }),
        hol
    ),
    deleteHoliday: (id) => fetch(`${API_URL}/holidays/${id}`, { method: 'DELETE' }).catch(e => console.warn(e)),

    // Settings
    getSettings: () => handleResponse(fetch(`${API_URL}/settings`), HOLIDAY_CONFIG),
    updateSettings: (settings) => handleResponse(
        fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        }),
        settings
    ),
};
