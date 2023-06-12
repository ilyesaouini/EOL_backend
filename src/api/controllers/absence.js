
var oracledb = require('oracledb');


async function run(router,connectionProperties) {
        
/**
   * POST / 
   * Saves a new employee 
   */
router.route('/absence/').post(function (request, response) {
    console.log("POST Absence:");
    oracledb.getConnection(connectionProperties, async function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
       
      var body = request.body;
      
  
      connection.execute("INSERT INTO ESP_ABSENCE (ID_ABSENCE, DATE_ABSENCE,MODULE,ETUDIANT)"+ 
                         "VALUES(ABSENCE_SEQ.NEXTVAL, :date_absence,:module,:etudiant)",
        [body.date_absence, body.module, body.etudiant],
        function (err, result) {
          if (err) {
            console.error(err.message);
            response.status(500).send("Error saving employee to DB");
            
            return;
          }
          response.end();
          
        });
    });
  });





/**
 * GET / 
 * Returns a list of employees 
 */
router.route('/absences/').get(function (request, response) {
  console.log("GET ABSENCES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM esp_absence",{},
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
          employees.push({ id_absence: element.ID_ABSENCE, 
                           date_absence: element.DATE_ABSENCE, 
                           module: element.MODULE,
                            etudiant: element.ETUDIANT });
                            console.log('iam here');

                           console.log(element.ETUDIANT);
        }, this);
       
        response.status(200).json({
          absence : employees
        });
        
        
      });
  });
});


/**
 * PUT / 
 * Update a employee 
 */


router.route('/absence/:id').put(function (request, response) {
  console.log("PUT ETUDIANT:");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    var body = request.body;
    var id = request.params.id;

    connection.execute("UPDATE ESP_ABSENCE SET DATE_ABSENCE=:date_absence, MODULE=:module, ETUDIANT=:etudiant"+
                       "WHERE ID_ABSENCE=:id",
      [body.date_absence, body.module,body.etudiant,  id],
      function (err, result) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error updating employee to DB");
          doRelease(connection); 
          return;
        }
        response.end();
        
      });
  });
});   





//get by id
router.get('/absence/:id', async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_ABSENCE WHERE ID_ABSENCE = :id`;
    const result = await connection.execute(query, { id });

    if (result.rows.length === 0) {
      return res.status(404).send('ABSENCE not found');
    }

    const user = result.rows[0];
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});



 /**
   * DELETE / 
   * Delete a employee 
   */
 router.route('/etudiant/:id').delete(function (request, response) {
  console.log("DELETE EMPLOYEE ID:"+request.params.id);
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    

    var body = request.body;
    var id = request.params.id;
    connection.execute("DELETE FROM ESP_ABSENCE WHERE ID_ABSENCE = :id",
      [id],
      function (err, result) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error deleting employee to DB");
          
          return;
        }
        response.end();
        
      });
  });
});
}
module.exports = {run}
