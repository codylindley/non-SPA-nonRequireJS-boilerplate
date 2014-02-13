var connect = require("connect");        

connect().use(connect.static('public')).listen(3044);

console.log('\nStatic file server running at http://localhost:' + '3044' + '/\n\nCTRL + C to shutdown server');