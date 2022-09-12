var mysql = require('mysql')
var connection = mysql.createConnection({
  host: '162.241.61.74',
  user: 'gacelajs_cgjose', //
  password: '1A4l9e9x-', //
  database: 'gacelajs_chrysalisguild',
})
connection.connect((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Database connected')
})
module.exports = connection