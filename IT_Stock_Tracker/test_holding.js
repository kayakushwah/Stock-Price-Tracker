async function test() {
  try {
    // 1. Register a test user
    const email = 'testuser_' + Date.now() + '@example.com';
    const regRes = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    const token = regData.token;
    console.log('Registered user successfully, token:', token);
    
    // 2. Add holding
    const holdRes = await fetch('http://localhost:5001/api/auth/holdings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        symbol: 'TCS.BSE',
        companyName: 'Tata Consultancy Services',
        qty: 3,
        avgPrice: 1000,
        purchaseDate: '2026-04-24'
      })
    });
    
    console.log('Add Holding Status:', holdRes.status);
    console.log('Add Holding Data:', await holdRes.json());
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
