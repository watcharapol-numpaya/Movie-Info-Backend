require('dotenv').config()

const Pool = require("pg").Pool;
 
const pool = new Pool({
  host: `${process.env.PGHOST}`,
  user: `${process.env.PGUSER}`,
  password: `${process.env.PGPASSWORD}`,
  port: `${process.env.PGPORT}`,
  database: `${process.env.PGDATABASE}`,
  ssl:true
});
 

module.exports= pool