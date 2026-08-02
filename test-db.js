const pg = require("pg");
const pool = new pg.Pool({ connectionString: "postgres://postgres.igqorgmirnedfqqgzixl:OZ8LF25LyxfdnFeK@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true" });
pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("Error:", err);
  else console.log("Success:", res.rows);
  pool.end();
});
