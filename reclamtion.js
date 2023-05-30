const middleware = require("./middleware");
var oracledb = require('oracledb');
const jwt = require("jsonwebtoken");
const config = require("./config");
const bcrypt = require('bcrypt');
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
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(body.password, salt);
      body.password = hash;
  
      connection.execute("INSERT INTO ESP_RECLAMATION (ID_RECLAMATION, DESCRIPTION, REPONSE,MODULE, ETUDIANT, ENSEIGNANT,RECLAMATION)"+ 
                         "VALUES(EMPLOYEE_SEQ.NEXTVAL, :nom_prenom,:nom,:prenom,:email,:tel, :password)",
        [body.id_etudiant, body.nom_prenom, body.nom, body.prenom, body.email, body.tel,  body.password],
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
router.route('/etudiants/').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM esp_etudiant",{},
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
          employees.push({ id_etudiant: element.ID_ETUDIANT, nom_prenom: element.NOM_PRENOM, 
                           nom: element.NOM, prenom: element.PRENOM, 
                           email: element.EMAIL, tel: element.TEL, 
                           classe: element.CLASSE, date_de_naissance: element.DATE_DE_NAISSANCE,
                           password: element.PASSWORD,image: element.IMAGE });
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


router.route('/etudiant/:id').put(function (request, response) {
  console.log("PUT ETUDIANT:");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    var body = request.body;
    var id = request.params.id;

    connection.execute("UPDATE ESP_ETUDIANT SET NOM_PRENOM=:nom_prenom, NOM=:nom, PRENOM=:prenom, EMAIL=:email,"+
                       " DATE_DE_NAISSANCE=:date_de_naissance, TEL=:tel,  WHERE ID_ETUDIANT=:id",
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
router.get('/etudiant/:id', async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_ETUDIANT WHERE ID_ETUDIANT = :id`;
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
    connection.execute("DELETE FROM ESP_ETUDIANT WHERE ID_ETUDIANT = :id",
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
