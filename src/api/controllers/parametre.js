const { json } = require('body-parser');
const { response } = require('express');
var oracledb = require('oracledb');
async function run(router,connectionProperties) {
router.route('/param').get(function(request,response){
    console.log("GET ABSENCES");
    oracledb.getConnection(connectionProperties, async function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
      console.log("After connection");
      const q = `SELECT * FROM esp_parametres  `;
      const r = await connection.execute(q);
console.log(r)
      response.send(r.rows[0][0])
    });
})    
}
module.exports = {run}