
var oracledb = require('oracledb');


async function run(router,connectionProperties) {


  /**
     * POST / 
     * Saves a new employee 
     */
  router.route('/inscription/').post(function (request, response) {
      console.log("POST ETUDIANT:");
      oracledb.getConnection(connectionProperties, async function (err, connection) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error connecting to DB");
          return;
        }
         
        var body = request.body;
        
    
        connection.execute("INSERT INTO ESP_INSCRIPTION (ID_INSCRIPTION, DESCRIPTION)"+ 
                           "VALUES(:id_inscription, :description)",
          [body.id_inscription, body.description],
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
  router.route('/inscriptions/:id').get(function (request, response) {
    console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    const { id } = request.params;
     const auto = `SELECT etat_resultat FROM ESP_AUTORISATION`;
    const resu = await connection.execute(auto );
    console.log(resu.rows[0][0]);
    if(resu.rows[0][0]==1){
    connection.execute("SELECT * FROM esp_inscription  where etudiant = :id",{id},
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
            id_inscription: element.ID_INSCRIPTION,
            etudiant: element.ETUDIANT,
            niveau_access: element.NIVEAU_ACCESS,
            code_classe: element.CODE_CLASSE,
            annee: element.ANNEE,
            moy_generale: element.MOY_GENERALE,
            moy_semestre1: element.MOY_SEMESTRE1,
            decision: element.DECISION,
                            });
                            console.log('iam here');

                           console.log(element.ETUDIANT);
        }, this);
        response.json(employees)["metaData"];
        
        
      });

    }else{
      response.send("resultat n'est pas encore autorisé")
    }
  });
  });
  
  
  /**
   * PUT / 
   * Update a employee 
   */
  
  
  router.route('/inscription/:id').put(function (request, response) {
    console.log("PUT ETUDIANT:");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
  
      var body = request.body;
      var id = request.params.id;
  
      connection.execute("UPDATE ESP_INSCRIPTION SET DESCRIPTION=:description  WHERE ID_INSCRIPTION=:id",
        [body.description,  id],
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
  router.get('/inscription/:id', async (req, res) => {
    const { id } = req.params;
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(connectionProperties);
  
      const query = `SELECT * FROM ESP_INSCRIPTION WHERE ETUDIANT = :id`;
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
   router.route('/inscription/:id').delete(function (request, response) {
    console.log("DELETE EMPLOYEE ID:"+request.params.id);
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
  
      
  
      var body = request.body;
      var id = request.params.id;
      connection.execute("DELETE FROM ESP_INSCRIPTION WHERE ETUDIANT = :id",
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
  