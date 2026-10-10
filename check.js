import http from 'http';

const req = http.request('http://localhost:3000/api/employees', (res) => {
    console.log('STATUS: ' + res.statusCode);
});
req.on('error', (e) => {
    console.log('ERROR: ' + e.message);
});
req.end();
