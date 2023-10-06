var oracledb = require('oracledb');


async function run(router,connectionProperties) {
    

    router.route('/addautorisation/').patch(function (request, response) {
        console.log("PUT EMPLOYEE:");
        oracledb.getConnection(connectionProperties, async function (err, connection) {
          if (err) {
            console.error(err.message);
            response.status(500).send("Error connecting to DB");
            return;
          }
          var body = request.body;
          console.log(body)
          connection.execute("UPDATE ESP_AUTORISATION SET ETAT_NOTE=:etat_note, ETAT_RESULTAT=:etat_resultat",
            [body.etat_note,body.etat_resultat],
            function (err, result) {
              if (err) {
                console.error(err.message);
                response.status(500).send("Error updating employee to DB");
                
                return;
              }
              console.log("response send succesfuly")
              response.send("response send succesfuly");
              
            });
        });
      });



/**
 * GET / 
 * Returns a list of employees 
 */
router.route('/autorisation/').get(function (request, response) {
    console.log("GET EMPLOYEES");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
      console.log("After connection");
      connection.execute("SELECT * FROM esp_autorisation",{},
        { outFormat: oracledb.OBJECT },
        function (err, result) {
          if (err) {
            console.error(err.message);
            response.status(500).send("Error getting data from DB");
            doRelease(connection);
            return;
          }
          console.log('iam here');
          console.log("RESULTSET:" + JSON.stringify(result));
          var employees = [];
          result.rows.forEach(function (element) {
            employees.push({ etat_note: element.ETAT_NOTE, 
                              etat_resultat: element.ETAT_RESULTAT, 
                              });
                              console.log('iam here');
  
                             console.log(element.ETAT_NOTE);
          }, this);
          response.json(employees)["metaData"];
          
          
        });
    });
  });
  
}
module.exports = {run}
