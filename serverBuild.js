var connect = require("connect");        

connect().use(connect.static('publicBuild')).listen(3045);

console.log('\nStatic file server running at http://localhost:' + '3045' + '/\n\nCTRL + C to shutdown server');