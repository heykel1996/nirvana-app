require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function resetPassword() {
  try {
    // Koneksi ke database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'nirvana-mep-db.mysql.database.azure.com',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'nirvana_residence',
      password: process.env.DB_PASSWORD || 'apartemen@2026',
      database: process.env.DB_NAME || 'nirvana_mep',
      ssl: { rejectUnauthorized: true }
    });

    console.log('✅ Connected to database');

    // Generate password hash untuk 'nirvana72'
    const password = 'nirvana72';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    console.log('Generated hash:', passwordHash);

    // Update password di database
    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ? WHERE username = ?',
      [passwordHash, 'nirvanaresidence']
    );

    console.log('Rows affected:', result.affectedRows);

    if (result.affectedRows > 0) {
      console.log('\n✅ ====================================');
      console.log('✅ PASSWORD BERHASIL DIRESET!');
      console.log('✅ ====================================');
      console.log('Username: nirvanaresidence');
      console.log('Password: nirvana72');
      console.log('======================================\n');
    } else {
      console.log('❌ User tidak ditemukan');
    }

    // Verify - coba login dengan password baru
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      ['nirvanaresidence']
    );

    if (users.length > 0) {
      const user = users[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      console.log('✅ Password verification:', isValid ? 'SUCCESS' : 'FAILED');
    }

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error(' Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

resetPassword();