
var oracledb = require('oracledb');

async function run(router,connectionProperties) {
    
/**
   * POST / 
   * Saves a new employee 
   */
router.route('/note/').post(function (request, response) {
    console.log("POST ETUDIANT:");
    oracledb.getConnection(connectionProperties, async function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return; 
      }
       
      var body = request.body;
      
      connection.execute("INSERT INTO ESP_NOTE (CODE_NOTE, NOTE_CC,NOTE_TP,NOTE_EXAMEN,ABS_CC,ABS_TP,ABS_EXAMEN, MODULE,ETUDIANT)"+ 
                         "VALUES(NOTE_SEQ.NEXTVAL,:note_cc,:note_tp,:note_examen,:abs_cc,:abs_tp,:abs_examen,:module,:etudiant)",
        [ body.note_cc,body.note_tp,body.note_examen,body.abs_cc,body.abs_tp,body.abs_examen, body.module, body.etudiant],
        function (err, result) {
          if (err) {
            console.error(err.message);
            response.status(500).send("Error saving NOTE to DB");
            
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
router.route('/notes/').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM esp_note",{},
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
          employees.push({ code_note: element.CODE_NOTE, 
                            note_cc: element.NOTE_CC, 
                            note_tp: element.NOTE_TP, 
                            note_examen: element.NOTE_EXAMEN, 
                            abs_cc: element.ABS_CC, 
                            abs_tp: element.ABS_TP, 
                            abs_examen: element.ABS_EXAMEN,   
                           module: element.MODULE,
                          etudiant: element.ETUDIANT, 
                            });
                            console.log('iam here');

                           console.log(element.CODE_NOTE);
        }, this);
        response.json(employees)["metaData"];
        
        
      });
  });
});




/**
 * PUT / 
 * Update a employee 
 */


router.route('/note/:id').put(function (request, response) {
  console.log("PUT ETUDIANT:");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    var body = request.body;
    var id = request.params.id;

    connection.execute("UPDATE ESP_NOTE SET NOM_PRENOM=:nom_prenom, NOM=:nom, PRENOM=:prenom, EMAIL=:email,"+
                       " DATE_DE_NAISSANCE=:date_de_naissance, TEL=:tel,  WHERE ETUDIANT=:id",
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
router.get('/notemodule/:module', async (req, res) => {
  const { module } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_NOTE WHERE module = :module`;
    const result = await connection.execute(query, { module });

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



//get by id
router.get('/noteetudiant/:etudiant', async (req, res) => {
  const { etudiant } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_NOTE WHERE etudiant = :etudiant`;
    const result = await connection.execute(query, { etudiant });

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


//get by id
router.get('/note/:id', async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_NOTE WHERE code_note = :id`;
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
    connection.execute("DELETE FROM ESP_ETUDIANT WHERE ETUDIANT = :id",
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

//get by id
router.get('/notebymodule/:etudiant', async (req, res) => {
  const { etudiant } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);
      


    const query = `SELECT * FROM ESP_NOTE WHERE etudiant = :etudiant`;
    const result = await connection.execute(query, { etudiant });
    var liste =[];
    
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }else{

      for(
        var i=0;i<= result.rows.length-1;i++
        ){ 
          m = result.rows[i];
           console.log(m?.[1]);
          
           etat = m?.[1]
           console.log("module"+etat)
          
          const query1 = `SELECT etat FROM ESP_ENTETE_NOTE WHERE code_module = :etat`;
          const result1 = await connection.execute(query1, {etat });
          if(result1.rows[0] == "validé"){
            //liste = liste+  result.rows[i];
           // liste.push(result.rows[i]);
            liste.push({code_note: result.rows[i]?.[0], 
              note_cc: result.rows[i]?.[1], 
              note_tp: result.rows[i]?.[2], 
              note_examen: result.rows[i]?.[3], 
              abs_cc: result.rows[i]?.[4], 
              abs_tp: result.rows[i]?.[5], 
              abs_examen: result.rows[i]?.[6],   
             module: result.rows[i]?.[7],
            etudiant: result.rows[i]?.[8],} );
            console.log(liste)
          }
        }
      }
      res.send(liste);
       
        
       
        
        
        
 
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
 * GET / 
 * Returns a list of employees 
 */
router.route('/note/:id').get(function (request, response) {
  console.log("GET ABSENCES");

  const { id } = request.params;
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM esp_note where CODE_NOTE = :id",{id},
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
          employees.push({ 
            
            code_note: element.CODE_NOTE, 
                            note_cc: element.NOTE_CC, 
                            note_tp: element.NOTE_TP, 
                            note_examen: element.NOTE_EXAMEN, 
                            abs_cc: element.ABS_CC, 
                            abs_tp: element.ABS_TP, 
                            abs_examen: element.ABS_EXAMEN,   
                           module: element.MODULE,
                          etudiant: element.ETUDIANT, 
                          
                          
                          });
                            console.log('iam here');

                           console.log(element.ETUDIANT);
        
        
                          }, this);
       
        response.send(employees[0]).status(200);
        
        
      });
  });
});



}
module.exports = {run}
