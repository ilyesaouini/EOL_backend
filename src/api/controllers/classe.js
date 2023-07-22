
var oracledb = require('oracledb');


async function run(router,connectionProperties) {


  /**
     * POST / 
     * Saves a new employee 
     */
  router.route('/classe/').post(function (request, response) {
      console.log("POST ETUDIANT:");
      oracledb.getConnection(connectionProperties, async function (err, connection) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error connecting to DB");
          return;
        }
         
        var body = request.body;
        
    
        connection.execute("INSERT INTO ESP_CLASSE (ID_CLASSE, DESCRIPTION)"+ 
                           "VALUES(:id_classe, :description)",
          [body.id_classe, body.description],
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
  router.route('/classes/').get(function (request, response) {
    console.log("GET EMPLOYEES");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
      console.log("After connection");
      connection.execute("SELECT * FROM esp_classe",{},
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
            employees.push({ id_classe: element.ID_CLASSE, description: element.DESCRIPTION });
                              console.log('iam here');
  
                             console.log(element.FIRSTNAME);
          }, this);
          response.json(employees)["metaData"];
          
          
        });
    });
  });
  
  
  /**
   * PUT / 
   * Update a employee 
   */
  
  
  router.route('/classe/:id').put(function (request, response) {
    console.log("PUT ETUDIANT:");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
  
      var body = request.body;
      var id = request.params.id;
  
      connection.execute("UPDATE ESP_CLASSE SET DESCRIPTION=:description  WHERE ID_CLASSE=:id",
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
  router.get('/classe/:id', async (req, res) => {
    const { id } = req.params;
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(connectionProperties);
  
      const query = `SELECT * FROM ESP_CLASSE WHERE ID_CLASSE = :id`;
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
   router.route('/classe/:id').delete(function (request, response) {
    console.log("DELETE EMPLOYEE ID:"+request.params.id);
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
  
      
  
      var body = request.body;
      var id = request.params.id;
      connection.execute("DELETE FROM ESP_CLASSE WHERE ID_CLASSE = :id",
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
  
   //get by id ENSEIGANT
   router.get('/classebyens/:id', async (req, res) => {
    const { id } = req.params;
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(connectionProperties);
  
      const query = `SELECT * FROM ESP_PLAN_CLASS_SESSION WHERE ENSEIGNANT = :id`;
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
  
  
  }
  module.exports = {run}
  