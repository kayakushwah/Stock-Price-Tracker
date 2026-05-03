async function test() {
    try {
        const res = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
        });
        const data = await res.json();
        if (!res.ok) {
            console.log('Login error:', data.message);
        } else {
            console.log('Login success:', data);
        }
    } catch (err) {
        console.log('Network error:', err.message);
    }
}
test();
