
var oracledb = require('oracledb');

async function run(router,connectionProperties) {
    



/**
 * GET / 
 * Returns a list of employees 
 */
router.route('/notesnew/').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM esp_note_new",{},
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
            code_module:element.CODE_MODULE, 
            num_panier:element.NUM_PANIER, 
            code_cl:element.CODE_CL, 
            annee_deb:element.ANNEE_DEB, 
            annee_fin:element.ANNEE_FIN, 
            id_et:element.ID_ET, 
            type_note:element.TYPE_NOTE, 
            nature_note:element.NATURE_NOTE, 
            taux_note:element.TAUX_NOTE, 
            observation:element.OBSERVATION, 
            date_deroulement:element.DATE_DEROULEMENT, 
            semestre:element.SEMESTRE, 
            id_ens:element.ID_ENS, 
            nbr_heure:element.NBR_HEURE, 
            type_session:element.TYPE_SESSION, 
            note_exam:element.NOTE_EXAM, 
            note_cc:element.NOTE_CC, 
            note_tp:element.NOTE_TP, 
            note_ratrap:element.NOTE_RATRAP, 
            absent:element.ABSENT, 
            absent_tp:element.ABSENT_TP, 
            absent_exam:element.ABSENT_EXAM, 
            absent_cc:element.ABSENT_CC, 
            utilisateur:element.UTILISATEUR, 
            numpromotioncs:element.NUMPROMOTIONCS, 
            niv_acquis_anglais:element.NIV_ACQUIS_ANGLAIS, 
            niveau_acquis:element.NIV_ACQUIS, 
            note_orale:element.NOTE_ORALE, 
            note_ecrit:element.NOTE_ECPRIT, 
            dispense:element.DISPENSE, 
            absent_orale:element.ABSENT_ORALE, 
            absent_ecrit:element.ABSENT_ECRIT, 
            niveau_actuel:element.NIVEAU_ACTUEL, 
            note_cc_lang:element.NOTE_CC_LANG, 
            note_orale_lang: element.NOTE_ORALE_LANG, 
            note_ecrit_lang:element.NOTE_ECRIT_LANG, 
            taux_cc_lang:element.TAUX_CC_LANG, 
            taux_orale_lang:element.TAUX_ORALE_LANG, 
            date_saisie:element.DATE_SAISIE, 
            date_last_modif:element.DATE_LAST_MODIF, 
            note_esb_01:element.NOTE_ESB_01, 
            note_esb_02:element.NOTE_ESB_02, 
            adresse_ip:element.ADRESSE_IP, 
            nom_machine:element.NOM_MACHINE, 
            note_ds1:element.NOTE_DS1, 
            note_ds2:element.NOTE_DS2, 
            note_ds3:element.NOTE_DS3, 
            note_ds4:element.NOTE_DS4, 
            note_ds5:element.NOTE_DS5, 
             
            note_colle:element.NOTE_COLLE, 
                            });
                            console.log('iam here');

                           console.log(element.CODE_NOTE);
        }, this);
        response.json(employees)["metaData"];
        
        
      });
  });
});








//get by id
router.get('/notemodule/:module', async (req, res) => {
  const { module } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);

    const query = `SELECT * FROM ESP_NOTENEW WHERE module = :module`;
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



/**
 * GET / 
 * Returns a list of employees 
 */
router.route('/notesnewetudiant/:id').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    const { id } = request.params;
    connection.execute("SELECT * FROM esp_note_new where id_et = :id ",{id},
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
          employees.push({ 
            code_module:element.CODE_MODULE, 
            num_panier:element.NUM_PANIER, 
            code_cl:element.CODE_CL, 
            annee_deb:element.ANNEE_DEB, 
            annee_fin:element.ANNEE_FIN, 
            id_et:element.ID_ET, 
            type_note:element.TYPE_NOTE, 
            nature_note:element.NATURE_NOTE, 
            taux_note:element.TAUX_NOTE, 
            observation:element.OBSERVATION, 
            date_deroulement:element.DATE_DEROULEMENT, 
            semestre:element.SEMESTRE, 
            id_ens:element.ID_ENS, 
            nbr_heure:element.NBR_HEURE, 
            type_session:element.TYPE_SESSION, 
            note_exam:element.NOTE_EXAM, 
            note_cc:element.NOTE_CC, 
            note_tp:element.NOTE_TP, 
            note_ratrap:element.NOTE_RATRAP, 
            absent:element.ABSENT, 
            absent_tp:element.ABSENT_TP, 
            absent_exam:element.ABSENT_EXAM, 
            absent_cc:element.ABSENT_CC, 
            utilisateur:element.UTILISATEUR, 
            numpromotioncs:element.NUMPROMOTIONCS, 
            niv_acquis_anglais:element.NIV_ACQUIS_ANGLAIS, 
            niveau_acquis:element.NIV_ACQUIS, 
            note_orale:element.NOTE_ORALE, 
            note_ecrit:element.NOTE_ECPRIT, 
            dispense:element.DISPENSE, 
            absent_orale:element.ABSENT_ORALE, 
            absent_ecrit:element.ABSENT_ECRIT, 
            niveau_actuel:element.NIVEAU_ACTUEL, 
            note_cc_lang:element.NOTE_CC_LANG, 
            note_orale_lang:element.NOTE_ORALE_LANG, 
            note_ecrit_lang:element.NOTE_ECRIT_LANG, 
            taux_cc_lang:element.TAUX_CC_LANG, 
            taux_orale_lang:element.TAUX_ORALE_LANG, 
            date_saisie:element.DATE_SAISIE, 
            date_last_modif:element.DATE_LAST_MODIF, 
            note_esb_01:element.NOTE_ESB_01, 
            note_esb_02:element.NOTE_ESB_02, 
            adresse_ip:element.ADRESSE_IP, 
            nom_machine:element.NOM_MACHINE, 
            note_ds1:element.NOTE_DS1, 
            note_ds2:element.NOTE_DS2, 
            note_ds3:element.NOTE_DS3, 
            note_ds4:element.NOTE_DS4, 
            note_ds5:element.NOTE_DS5, 
             
            note_colle:element.NOTE_COLLE, 
                            });
                            console.log('iam here');

                           console.log(element.CODE_NOTE);
        }, this);
        response.json(employees)["metaData"];
        
        
      });
  });
});









//get by id
router.get('/notebymodules/:etudiant', async (req, res) => {
  const { etudiant } = req.params;

  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);
      


    const query = `SELECT * FROM ESP_NOTE_NEW WHERE id_et = :etudiant`;
    const result = await connection.execute(query, { etudiant });
      m = result.rows.module;
      console.log(m);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    const query1 = `SELECT confirmation FROM ESP_ENTETE_NOTE_NEW WHERE module = :module`;
    const result1 = await connection.execute(query1, { m });
    
    if(result1.rows.confirmation == "y"){
      const user = result.rows[0];
      res.send(user);

    }else{
      return res.status(201).send('note ne pas encore validée');
    }
 
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
