var mysql = require('mysql')
// var connection = mysql.createConnection({
//   host: '162.241.61.74',
//   user: 'gacelajs_cgjose', //
//   password: '1A4l9e9x-', //
//   database: 'gacelajs_chrysalisguild',
// })
// connection.connect(function(error){
//   if(!!error) console.log(error);
//    else console.log('SQL Database Connected!');
// });


var db_config = {
  host: '162.241.61.74',
    user: 'gacelajs_cgjose',
    password: '1A4l9e9x-',
    database: 'gacelajs_chrysalisguild'
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
setInterval(function () {  connection.query('SELECT 1'); }, 5000); 
module.exports = connection