var oracledb = require('oracledb');

async function run(router,connectionProperties){



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
    connection.execute("INSERT INTO ESP_ABSENCE_NEW (ID_ET,CODE_MODULE,CODE_CL,ANNEE_DEB,NUM_SEANCE,DATE_SEANCE,ID_ENS,DATE_SAISIE,UTILISATEUR,SEMESTRE,JUSTIFICATION,CODE_JUSTIF,LIB_JUSTIF,A_CONVOQUER,OBSERVATION,NEW_SEMESTRE) values"+
    "(:id_et,:code_module,:code_cl,:annee_deb,:num_seance,:date_seance,:id_ens,:date_saisie,:utilisateur,:semestre,:justification)",
    [body.id_et,body.code_module,body.code_cl,body.annee_deb,body.num_seance,body.date_seance,body.id_ens,body.date_saisie,body.utilisateur,body.semestre,body.justification])
})

});





/**
 * GET / 
 * Returns a list of employees 
 */
router.route('/all/').get(function (request, response) {
  console.log("GET ABSENCES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM esp_absence_new",{},
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













  router.route('absencesbyid/:id').get(function (request, response) {
    console.log("GET ABSENCES");
    const { id } = request.params;
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
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
  
                             console.log(element.ETUDIANT);
          }, this);
         
          response.status(200).json({
            absence : employees
          });
          
          
        });
    });
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