
var oracledb = require('oracledb');
const axios = require('axios');
const { checkToken } = require('../middlewares/middleware');

async function run(router,connectionProperties,u) {


  /**
     * POST / 
     * Saves a new employee 
     */
  router.route('/entete_note/').post(function (request, response) {
      console.log("POST ETUDIANT:");
      oracledb.getConnection(connectionProperties, async function (err, connection) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error connecting to DB");
          return;
        }
         
        var body = request.body;
        
    
        connection.execute("INSERT INTO ESP_entete_note (ID_EMLOI, entete_note)"+ 
                           "VALUES(:id_entete_note, :entete_note)",
          [body.id_entete_note, body.entete_note],
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
  router.route('/entete_notes/').get(function (request, response) {
    console.log("GET EMPLOYEES");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
      console.log("After connection");
      connection.execute("SELECT * FROM ESP_ENTETE_NOTE",{},
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
            employees.push({ code_module: element.CODE_MODULE, 
                classe: element.CLASSE,
                enseignant: element.ENSEIGNANT,
                etat: element.ETAT,
                annee: element.CLASSE,
                semestre: element.SEMESTRE,
             });
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
  
  
  router.route('/entete_note/:id').put(function (request, response) {
    console.log("PUT ETUDIANT:");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
  
      var body = request.body;
      var id = request.params.id;
  
      connection.execute("UPDATE ESP_entete_note SET entete_note=:entete_note  WHERE ID_entete_note=:id",
        [body.entete_note,  id],
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
  
  
  
  
  
 router.route('/entete_note/:etudiant').get(  async function  (request, response){

   console.log("GET EMPLOYEES");
   oracledb.getConnection(connectionProperties, async function (err, connection) {
     if (err) {
       console.error(err.message);
       response.status(500).send("Error connecting to DB");
       return;
      }
      const {etudiant} = request.params

    const query = `SELECT * FROM ESP_NOTE WHERE etudiant = :etudiant`;
    const result = await connection.execute(query, { etudiant });
    console.log(result);
    if(result.rows.length != 0){

      var note=[];
      for (var count =0 ; count <result.rows.length; count++)
      {
        m = result.rows[count];
        console.log(m[1]);
        
        const rs1 =  await axios.get('https://localhost:8089/entete_module/'+m[1]);
        console.log("++++++");
        console.log(rs1.data);
        if(rs1.data == 'validé'){
          console.log(m);
          
          note.push(m);
            
          
        }
      }
      response.json(note)["metaData"];
      return note;
    }
 });
  });
  

   //get by enseignant
  router.get('/entete_ens/:id', async (req, res) => {
    const { id } = req.params;
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(connectionProperties);
  
      const query = `SELECT * FROM ESP_entete_note WHERE ENSEIGNANT = :id`;
      const result = await connection.execute(query, { id });
  
      if (result.rows.length === 0) {
        return res.status(404).send('User not found');
      }
  
      const user = result.rows[0];
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
  

  //get by module
  router.get('/entete_module/:id', async (req, res) => {
    const { id } = req.params;
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(connectionProperties);
  
      const query = `SELECT etat FROM ESP_entete_note WHERE CODE_MODULE = :id`;
      const result = await connection.execute(query, { id });
  
      if (result.rows.length === 0) {
        return res.status(404).send('User not found');
      }
  
      const user = result.rows;
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
  
//get by classe
router.get('/entete_cls/:id', async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_entete_note WHERE CLASSE = :id`;
    const result = await connection.execute(query, { id });

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = result.rows[0];
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
   router.route('/entete_note/:id').delete(function (request, response) {
    console.log("DELETE EMPLOYEE ID:"+request.params.id);
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
  
      
  
      var body = request.body;
      var id = request.params.id;
      connection.execute("DELETE FROM ESP_entete_note WHERE ID_entete_note = :id",
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
  