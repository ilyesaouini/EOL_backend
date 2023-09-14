
var oracledb = require('oracledb');
const axios = require('axios');

async function run(router,connectionProperties) {
        
/**
   * POST / 
   * Saves a new employee 
   */
router.route('/postabsence/').post(function (request, response) {
    console.log("POST Absence:");
    oracledb.getConnection(connectionProperties, async function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
       
      var body = request.body;
      
  
      connection.execute("INSERT INTO ESP_ABSENCE_NEW (ID_ET,CODE_MODULE,CODE_CL,ANNEE_DEB,NUM_SEANCE,DATE_SEANCE,ID_ENS,DATE_SAISIE,UTILISATEUR,SEMESTRE,JUSTIFICATION,CODE_JUSTIF,LIB_JUSTIF,A_CONVOQUER,OBSERVATION,NEW_SEMESTRE) values"+
    "(:id_et,:code_module,:code_cl,:annee_deb,:num_seance,:date_seance,:id_ens,:date_saisie,:utilisateur,:semestre,:justification,:code_justif,:lib_justif,a_convoquer,observation,new_semestre)",
    [body.id_et,body.code_module,body.code_cl,body.annee_deb,body.num_seance,body.date_seance,body.id_ens,body.date_saisie,body.utilisateur,body.semestre,body.justification,body.code_justif,body.lib_justif,body.a_convoquer,body.observation,body.new_semestre],
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
 * GET / 
 * Returns a list of employees 
 */
router.route('/absence/:id').get(function (request, response) {
  console.log("GET ABSENCES");

  const { id } = request.params;
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM esp_absence where ID_ABSENCE = :id",{id},
      { outFormat: oracledb.OBJECT },
      function (err, result) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error getting data from DB");
          
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
       
        response.send(employees[0]).status(200);
        
        
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


//get by id
router.get('/absenceetudiant/:id', async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_ABSENCE WHERE ETUDIANT = :id`;
    const result = await connection.execute(query, { id });

    if (result.rows.length === 0) {
      return res.status(404).send('ABSENCE not found');
    }

    const user = result.rows;
    res.send(result.rows);
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

router.route('/getabsences/:id').get(async function (request, response) {
  console.log("GET ABSENCES");
  oracledb.getConnection(connectionProperties,async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }


    id = request.params.id;
    const rs1 =  await axios.get('https://localhost:8089/user/'+id); 
    console.log(rs1.data);

    if(rs1.data == '01'){
      console.log("absence etudiant");
    }
    
    console.log("After connection");
   
  });
});



/**
 * GET / 
 * Returns a list of employees 
 */
router.route('/user/:id').get(function (request, response) {
  console.log("GET ABSENCES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    const {id} = request.params
    console.log("After connection");
    connection.execute("SELECT ROLE FROM esp_user where id=:id",{id},
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
          employees.push({ role: element.ROLE, 
                            });
                            console.log('iam here');

                           console.log(element.ROLE);
        }, this);
       
        response.send(employees[0]).status(200);
        
        
      });
  });
});

}
module.exports = {run}
