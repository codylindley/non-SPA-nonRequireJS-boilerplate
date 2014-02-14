var connect = require("connect");        

connect().use(connect.static('production')).listen(3045);

console.log('\nStatic file server running at http://localhost:' + '3044' + '/\n\nCTRL + C to shutdown server');