require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDB() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: true }
    });

    console.log('✅ Connected to database');

    // Test query
    const [rows] = await connection.execute(
      'SELECT id, username, password_hash, full_name, role, department FROM users WHERE username = ?',
      ['nirvanaresidence']
    );

    console.log('\n📊 Query Result:');
    console.log('Rows count:', rows.length);
    console.log('Rows:', JSON.stringify(rows, null, 2));

    if (rows.length > 0) {
      const user = rows[0];
      console.log('\n✅ User found:');
      console.log('ID:', user.id);
      console.log('Username:', user.username);
      console.log('Password hash:', user.password_hash ? 'EXISTS (' + user.password_hash.length + ' chars)' : 'NULL/UNDEFINED');
      console.log('Full name:', user.full_name);
      console.log('Role:', user.role);
      console.log('Department:', user.department);
    } else {
      console.log('\n❌ User NOT found in database');
      console.log('Try: SELECT * FROM users;');
    }

    await connection.end();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('\n❌ Database Error:', error.message);
    console.error(error.stack);
  }
}

testDB();