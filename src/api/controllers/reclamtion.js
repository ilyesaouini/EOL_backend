
var oracledb = require('oracledb');
const axios = require('axios');

async function run(router,connectionProperties) {
    
/**
   * POST / 
   * Saves a new employee 
   */
router.route('/reclamation/').post(function (request, response) {
    console.log("POST ETUDIANT:");
    oracledb.getConnection(connectionProperties, async function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
       
      var body = request.body;
      const rs1 =  await axios.get('http://localhost:8089/module/'+body.module);
      console.log(rs1.data);
     body.status= "encours"
      connection.execute("INSERT INTO ESP_RECLAMATION (ID_RECLAMATION, DESCRIPTION,MODULE,ETUDIANT,ENSEIGNANT,STATUS)"+ 
                         "VALUES(RECLAMATION_SEQ.NEXTVAL, :description,:module,:etudiant,:enseignant,:status)",
        [body.description,body.module,body.etudiant,body.enseignant,body.status],
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
   * POST / 
   * Saves a new employee 
   */
router.route('/reclamationabsence/').post(function (request, response) {
  console.log("POST ETUDIANT:");
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
     
    var body = request.body;
    
   body.status= "encours"
    connection.execute("INSERT INTO ESP_RECLAMATION (ID_RECLAMATION, DESCRIPTION,MODULE,ETUDIANT,STATUS)"+ 
                       "VALUES(RECLAMATION_SEQ.NEXTVAL, :description,:module,:etudiant,:status)",
      [body.description,body.module,body.etudiant,body.status],
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
router.route('/reclamations/').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM ESP_RECLAMATION",{},
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
          employees.push({ id_reclamation: element.ID_RECLAMATION, description: element.DESCRIPTION,
                            reponse: element.REPONSE, 
                           module: element.MODULE, etudiant: element.ETUDIANT, 
                           enseignant: element.ENSEIGNANT, Rereclamation: element.RECLAMATION, 
                           status: element.STATUS,  });
                            console.log('iam here');

                           console.log(element.ID_RECLAMATION);
        }, this);
        response.json(employees)["metaData"];
        
        
      });
  });
});



router.route('/reclamationsetudiant/:id').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    const { id } = request.params;
    connection.execute("SELECT * FROM ESP_RECLAMATION where etudiant = :id",{id},
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
          employees.push({ id_reclamation: element.ID_RECLAMATION, description: element.DESCRIPTION,
                            reponse: element.REPONSE, 
                           module: element.MODULE, etudiant: element.ETUDIANT, 
                           enseignant: element.ENSEIGNANT, Rereclamation: element.RECLAMATION, 
                           status: element.STATUS,  });
                            console.log('iam here');

                           console.log(element.ID_RECLAMATION);
        }, this);
        response.json(employees)["metaData"];
        
        
      });
  });
});

router.route('/reclamationsenseignant/:id').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    const { id } = request.params;
    connection.execute("SELECT * FROM ESP_RECLAMATION where enseignant = :id",{id},
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
          employees.push({ id_reclamation: element.ID_RECLAMATION, description: element.DESCRIPTION,
                            reponse: element.REPONSE, 
                           module: element.MODULE, etudiant: element.ETUDIANT, 
                           enseignant: element.ENSEIGNANT, Rereclamation: element.RECLAMATION, 
                           status: element.STATUS,  });
                            console.log('iam here');

                           console.log(element.ID_RECLAMATION);
        }, this);
        response.json(employees)["metaData"];
        
        
      });
  });
});


/**
 * PUT / 
 * Update a employee 
 */


router.route('/reclamation/:id').put(function (request, response) {
  console.log("PUT ETUDIANT:");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    var body = request.body;
    var id = request.params.id;

    connection.execute("UPDATE ESP_RECLAMATION SET NOM_PRENOM=:nom_prenom, NOM=:nom, PRENOM=:prenom, EMAIL=:email,"+
                       " DATE_DE_NAISSANCE=:date_de_naissance, TEL=:tel,  WHERE ID_RECLAMATION=:id",
      [body.nom_prenom, body.nom,body.prenom, body.email, body.date_de_naissance, body.tel,  id],
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
router.get('/reclamation/:id', async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_RECLAMATION WHERE ID_RECLAMATION = :id`;
    const result = await connection.execute(query, { id });

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
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
 router.route('/reclamation/:id').delete(function (request, response) {
  console.log("DELETE EMPLOYEE ID:"+request.params.id);
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    

    var body = request.body;
    var id = request.params.id;
    connection.execute("DELETE FROM ESP_RECLAMATION WHERE ID_RECLAMATION = :id",
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




    
/**
   * POST / 
   * Saves a new employee 
   */
router.route('/reclamationsimple/').post(function (request, response) {
  console.log("POST ETUDIANT:");
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
     
    var body = request.body;
   
   body.status= "encours"
    connection.execute("INSERT INTO ESP_RECLAMATION (ID_RECLAMATION, DESCRIPTION,ETUDIANT,STATUS)"+ 
                       "VALUES(RECLAMATION_SEQ.NEXTVAL, :description,:etudiant,:status)",
      [body.description,body.etudiant,body.status],
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
 * update image
 */

 router.route('/reponse/').patch(function (request, response) {
  console.log("PUT EMPLOYEE:");
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    var reponse = request.body.reponse;
    var id = request.body.id;
    var sta = request.body.status;
    
    connection.execute("UPDATE ESP_RECLAMATION SET REPONSE=:reponse, STATUS=:status WHERE ID_RECLAMATION=:id",
      [reponse,sta, id],
      function (err, result) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error updating employee to DB");
          
          return;
        }
        response.send("response send succesfuly");
        
      });
  });
});







/**
 * GET / 
 * Returns a list of employees 
 */
router.route('/reclamationetudiant/:id').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    const { id } = request.params;

    console.log("After connection");
    connection.execute("SELECT * FROM ESP_RECLAMATION where etudiant = :id",{id},
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
          employees.push({ id_reclamation: element.ID_RECLAMATION, description: element.DESCRIPTION,
                            reponse: element.REPONSE, 
                           module: element.MODULE, etudiant: element.ETUDIANT, 
                           enseignant: element.ENSEIGNANT, Rereclamation: element.RECLAMATION, 
                           status: element.STATUS,  });
                            console.log('iam here');

                           console.log(element.ID_RECLAMATION);
        }, this);
        response.json(employees)["metaData"];
        
        
      });
  });
});

}
module.exports = {run}
