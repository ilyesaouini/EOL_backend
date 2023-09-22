
var oracledb = require('oracledb');
const multer = require('multer');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
async function run(router,connectionProperties) {


  /**
     * POST / 
     * Saves a new employee 
     */
  
  router.route('/emploi/').post(function (request, response) {
      console.log("POST ETUDIANT:");
      oracledb.getConnection(connectionProperties, async function (err, connection) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error connecting to DB");
          return;
        }
         
        var body = request.body;
        
    
        connection.execute("INSERT INTO ESP_EMPLOI (ID_EMPLOI, EMPLOI)values " + 
        "(EMPLOI_SEQ.NEXTVAL :emploi)",
[ body],
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
  router.route('/emplois/').get(function (request, response) {
    console.log("GET EMPLOYEES");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
      console.log("After connection");
      connection.execute("SELECT * FROM esp_emploi",{},
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
            employees.push({ id_emploi: element.ID_EMPLOI, emploi: element.EMPLOI });
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
  
  
  router.route('/emploi/:id').put(function (request, response) {
    console.log("PUT ETUDIANT:");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
  
      var body = request.body;
      var id = request.params.id;
  
      connection.execute("UPDATE ESP_EMPLOI SET EMPLOI=:emploi  WHERE ID_EMPLOI=:id",
        [body.emploi,  id],
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
  router.get('/emploi/:id', async (req, res) => {
    const { id } = req.params;
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(connectionProperties);
  
      const query = `SELECT * FROM ESP_EMPLOI WHERE ID_EMPLOI = :id`;
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
   router.route('/emploi/:id').delete(function (request, response) {
    console.log("DELETE EMPLOYEE ID:"+request.params.id);
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
  
      
  
      var body = request.body;
      var id = request.params.id;
      connection.execute("DELETE FROM ESP_EMPLOI WHERE ID_EMPLOI = :id",
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
  