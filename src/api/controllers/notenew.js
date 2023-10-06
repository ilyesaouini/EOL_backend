
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
      
    const auto = `SELECT etat_note FROM ESP_AUTORISATION`;
    const resu = await connection.execute(auto );
    console.log(resu.rows[0][0]);
    if(resu.rows[0][0]==0){

      const query = `SELECT * FROM ESP_NOTE_NEW WHERE id_et = :etudiant`;
      const result = await connection.execute(query, { etudiant });
      m = result.rows[0][0];
      console.log(m);
      if (result.rows.length === 0) {
        return res.status(404).send('User not found');
    }
    const query1 = `SELECT confirmation FROM ESP_ENTETE_NOTE_NEW WHERE code_module = :m`;
    const result1 = await connection.execute(query1, { m });
    console.log(result1.rows[0])
    if(result1.rows[0] == "y"){
      const user = result.rows[0];
      res.send(user);

    }else{
      return res.status(201).send('note ne pas encore validée');
    }
    
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





//get by id
router.get('/listenotebymodules/:etudiant', async (req, res) => {
  const { etudiant } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection(connectionProperties);
    const auto = `SELECT etat_note FROM ESP_AUTORISATION`;
    const resu = await connection.execute(auto );
    console.log(resu.rows[0][0]);
    if(resu.rows[0][0]==1){


      const query = `SELECT * FROM ESP_NOTE_NEW WHERE id_et = :etudiant`;
    const result = await connection.execute(query, { etudiant });
    var liste =[];
    
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }else{

      for(
        var i=0;i<= result.rows.length-1;i++
        ){ 
          m = result.rows[i];
           console.log(m?.[0]);
          
           etat = m?.[0]
           console.log("module"+etat)
          
           const query1 = `SELECT confirmation FROM ESP_ENTETE_NOTE_NEW WHERE code_module = :etat`;
          const result1 = await connection.execute(query1, {etat });
          if(result1.rows[0] == "y"){
            //liste = liste+  result.rows[i];
           // liste.push(result.rows[i]);
            liste.push({
              code_module:result.rows[i]?.[0], 
            num_panier:result.rows[i]?.[1], 
            code_cl:result.rows[i]?.[2], 
            annee_deb:result.rows[i]?.[3], 
            annee_fin:result.rows[i]?.[4], 
            id_et:result.rows[i]?.[5], 
            type_note:result.rows[i]?.[6], 
            nature_note:result.rows[i]?.[7], 
            taux_note:result.rows[i]?.[8], 
            observation:result.rows[i]?.[9], 
            date_deroulement:result.rows[i]?.[10], 
            semestre:result.rows[i]?.[11], 
            id_ens:result.rows[i]?.[12], 
            nbr_heure:result.rows[i]?.[13], 
            type_session:result.rows[i]?.[14], 
            note_exam:result.rows[i]?.[15], 
            note_cc:result.rows[i]?.[16], 
            note_tp:result.rows[i]?.[17], 
            note_ratrap:result.rows[i]?.[18], 
            absent:result.rows[i]?.[19], 
            absent_tp:result.rows[i]?.[20], 
            absent_exam:result.rows[i]?.[21], 
            absent_cc:result.rows[i]?.[22], 
            utilisateur:result.rows[i]?.[23], 
            numpromotioncs:result.rows[i]?.[24], 
            niv_acquis_anglais:result.rows[i]?.[25], 
            niveau_acquis:result.rows[i]?.[26], 
            note_orale:result.rows[i]?.[27], 
            note_ecrit:result.rows[i]?.[28], 
            dispense:result.rows[i]?.[29], 
            absent_orale:result.rows[i]?.[30], 
            absent_ecrit:result.rows[i]?.[31], 
            niveau_actuel:result.rows[i]?.[32], 
            note_cc_lang:result.rows[i]?.[33], 
            note_orale_lang:result.rows[i]?.[34], 
            note_ecrit_lang:result.rows[i]?.[35], 
            taux_cc_lang:result.rows[i]?.[36], 
            taux_orale_lang:result.rows[i]?.[37], 
            date_saisie:result.rows[i]?.[38], 
            date_last_modif:result.rows[i]?.[39], 
            note_esb_01:result.rows[i]?.[40], 
            note_esb_02:result.rows[i]?.[41], 
            adresse_ip:result.rows[i]?.[42], 
            nom_machine:result.rows[i]?.[43], 
            note_ds1:result.rows[i]?.[44], 
            note_ds2:result.rows[i]?.[45], 
            note_ds3:result.rows[i]?.[46], 
            note_ds4:result.rows[i]?.[47], 
            note_ds5:result.rows[i]?.[48], 
             
            note_colle:result.rows[i]?.[49], 
          } );
            console.log(liste)
          }
        }
      }
      res.send(liste);
    }else{
      res.send('note non autorsié');
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
