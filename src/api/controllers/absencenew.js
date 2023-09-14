var oracledb = require('oracledb');

async function run(router,connectionProperties){


/**
   * POST / 
   * Saves a new employee 
   */
router.route('/postabsence1/').post(function (request, response) {
  console.log("POST Absence:");
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
     
    var body = request.body;
    

    connection.execute("INSERT INTO ESP_ABSENCE_NEW (ID_ET,CODE_MODULE,CODE_CL,ANNEE_DEB,NUM_SEANCE,DATE_SEANCE,ID_ENS,DATE_SAISIE) values"+
  "(:ID_ET,:CODE_MODULE,:CODE_CL,:ANNEE_DEB,:NUM_SEANCE,:DATE_SEANCE,:ID_ENS,:DATE_SAISIE)",
  [body.ID_ET,body.CODE_MODULE,body.CODE_CL,body.ANNEE_DEB,body.NUM_SEANCE,body.DATE_SEANCE,body.ID_ENS,body.date_saisie],
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
     * post absence
     */
router.route('addabsence/').post(function(request,response){
console.log("post absence");
oracledb.getConnection(connectionProperties,async function(err,connection){

    if(err){
        con.error(err.message);
        response.status(500).send("error connection to db");
        return;
    }
    var body = request.body;
    console.log("body is :"+body);
    connection.execute("INSERT INTO ESP_ABSENCE_NEW (id_et,code_module,code_cl,annee_deb,num_seance,date_seance,id_ens) values"+
    "(:id_et,:code_module,:code_cl,:annee_deb,:num_seance,:date_seance,:id_ens)",
    [body.id_et,body.code_module,body.code_cl,body.annee_deb,body.num_seance,body.date_seance,body.id_ens],
        function (err, result) {
          if (err) {
            console.log("ssss")
            console.error(err.message);
            response.status(500).send(err.message);
            
            return;
          }
          response.end();
          
        });
})

});

router.route('addabsence1/').post(function(request,response){
  console.log("post absence");
  oracledb.getConnection(connectionProperties,async function(err,connection){
  
      if(err){
          con.error(err.message);
          response.status(500).send("error connection to db");
          return;
      }
      var body = request.body;
      console.log("body is :"+body);
      const query = 'INSERT INTO ESP_ABSENCE_NEW (ID_ET,CODE_MODULE,CODE_CL,ANNEE_DEB,NUM_SEANCE,DATE_SEANCE,ID_ENS,DATE_SAISIE,UTILISATEUR,SEMESTRE,JUSTIFICATION,CODE_JUSTIF,LIB_JUSTIF,A_CONVOQUER,OBSERVATION,NEW_SEMESTRE) values(?)';
    connection.execute(query, body);
    })
  });




/**
 * GET / 
 * Returns a list of employees 
 */
router.route('/allabsences/').get(function (request, response) {
  console.log("GET ABSENCES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM esp_absence_new ",{},
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
          employees.push({ id_et: element.ID_ET, 
            code_module: element.CODE_MODULE, 
            code_cl: element.CODE_CL, 
            id_ens: element.ID_ENS,
            annee:element.ANNEE_DEB,
            num_seance:element.NUM_SEANCE,
            date_seance:element.DATE_SEANCE,
            semestre:element.SEMESTRE });
                            console.log('iam here');

                           console.log(element.ID_ET);
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
router.route('/allabsenceetudiant/:id').get(function (request, response) {
  console.log("GET ABSENCES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    const { id } = request.params;
    console.log("After connection");
    connection.execute("SELECT * FROM esp_absence_new where id_et = :id",{id},
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
          employees.push({ id_et: element.ID_ET, 
            code_module: element.CODE_MODULE, 
            code_cl: element.CODE_CL, 
            id_ens: element.ID_ENS,
            annee:element.ANNEE_DEB,
            num_seance:element.NUM_SEANCE,
            date_seance:element.DATE_SEANCE,
            semestre:element.SEMESTRE });
                            console.log('iam here');

                           console.log(element.ID_ET);
        }, this);
       
        response.status(200).json({
          absence : employees
        });
        
        
      });
  });
});






//get by id
router.get('/absenceetudiantnew/:id', async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_ABSENCE_NEW WHERE ID_ET = :id`;
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



//get by id
router.get('/absenseignant/:id', async (req, res) => {
  const { id } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_ABSENCE_NEW WHERE ID_ENS = :id`;
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
}

module.exports ={run}




/*
id_et: element.ID_ET, 
                             code_module: element.CODE_MODULE, 
                             code_cl: element.CODE_CL, 
                             id_ens: element.ID_ENS,
                             annee:element.ANNEE_DEB,
                             num_seance:element.NUM_SEANCE,
                             date_seance:element.DATE_SEANCE,
                             semestre:element.SEMESTRE
                             */