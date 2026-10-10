import http from 'http';

console.log("Checking Server Status...");

http.get('http://localhost:3000/api/employees', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Response: ${data.substring(0, 200)}...`);
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
