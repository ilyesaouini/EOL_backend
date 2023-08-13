
var oracledb = require('oracledb');
const axios = require('axios');
const { checkToken } = require('../middlewares/middleware');
const { request } = require('express');

async function run(router,connectionProperties,u) {


  
  
  
  
  
  
  /**
   * GET / 
   * Returns a list of employees 
   */
  router.route('/entete_notesnew/').get(function (request, response) {
    console.log("GET EMPLOYEES");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
      console.log("After connection");
      connection.execute("SELECT * FROM ESP_ENTETE_NOTE_NEW",{},
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
                code_module: element.CODE_MODULE, 
                num_panier: element.NUM_PANIER, 
                code_cl: element.CODE_CL, 
                annee_deb: element.ANNEE_DEB, 
                annee_fin: element.ANNEE_FIN, 
                id_ens: element.ID_ENS, 
                type_session: element.TYPE_SESSION, 
                nature_note: element.NATURE_NOTE, 
                observation: element.OBSERVATION, 
                date_deroulement: element.DATE_DEROULEMENT, 
                semestre: element.SEMESTRE, 
                nb_heure: element.NB_HEURE, 
                confirmation: element.CONFIRMATION, 
                date_saisie: element.DATE_SAISIE, 
                date_confirmation: element.DATE_CONFIRMATION, 
                taux_exam: element.TAUX_EXAM, 
                taux_cc: element.TAUX_CC, 
                taux_tp: element.TAUX_TP, 
                existe_note_cc: element.EXISTE_NOTE_CC, 
                existe_note_tp: element.EXISTE_NOTE_TP, 
                coef: element.COEF,
                date_ratrap: element.DATE_RATRAP, 
                user_name: element.USER_NAME,
                conf_rattrapage: element.CONF_RATTRAPAGE,
                date_conf_ratt: element.DATE_CONF_RATT, 
                user_confirm:element.USER_CONFIRM,
                date_last_modif:element.DATE_LAST_MODIF,
                user_last_modif:element.USER_LAST_MODIF,
                tatouage_ens: element.TATOUAGE_ENS, 
                confirm_new: element.CONFIRM_NEW, 
                numpromotioncs: element.NUMPROMOTIONCS, 
                taux_ecrit_lang: element.TAUX_ORAL_LANG, 
                taux_oral_lang: element.TAUX_ORAL_LANG, 
                taux_cc_lang: element.TAUX_CC_LANG,
                module_fantome: element.MODULE_FANTOME,
                nbre_ds: element.NBRE_DS,
                existe_colle: element.EXISTE_COLLE,
                designation_module: element.DESIGNATION_MODULE,
                 
                
                
             });
                              console.log('iam here');
  
                             console.log(element.FIRSTNAME);
          }, this);
          response.json(employees)["metaData"];
          
          
        });
    });
  });
  

  
  
  /**
   * GET / 
   * Returns a list of employees 
   */
  router.route('/entete_notesnew/:id').get(function (request, response) {
   
    const { id } = request.params;

    console.log("GET EMPLOYEES");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
      console.log("After connection");
      connection.execute("SELECT * FROM ESP_ENTETE_NOTE_NEW where id_ens=:id",{id},
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
                code_module: element.CODE_MODULE, 
                num_panier: element.NUM_PANIER, 
                code_cl: element.CODE_CL, 
                annee_deb: element.ANNEE_DEB, 
                annee_fin: element.ANNEE_FIN, 
                id_ens: element.ID_ENS, 
                type_session: element.TYPE_SESSION, 
                nature_note: element.NATURE_NOTE, 
                observation: element.OBSERVATION, 
                date_deroulement: element.DATE_DEROULEMENT, 
                semestre: element.SEMESTRE, 
                nb_heure: element.NB_HEURE, 
                confirmation: element.CONFIRMATION, 
                date_saisie: element.DATE_SAISIE, 
                date_confirmation: element.DATE_CONFIRMATION, 
                taux_exam: element.TAUX_EXAM, 
                taux_cc: element.TAUX_CC, 
                taux_tp: element.TAUX_TP, 
                existe_note_cc: element.EXISTE_NOTE_CC, 
                existe_note_tp: element.EXISTE_NOTE_TP, 
                coef: element.COEF,
                date_ratrap: element.DATE_RATRAP, 
                user_name: element.USER_NAME,
                conf_rattrapage: element.CONF_RATTRAPAGE,
                date_conf_ratt: element.DATE_CONF_RATT, 
                user_confirm:element.USER_CONFIRM,
                date_last_modif:element.DATE_LAST_MODIF,
                user_last_modif:element.USER_LAST_MODIF,
                tatouage_ens: element.TATOUAGE_ENS, 
                confirm_new: element.CONFIRM_NEW, 
                numpromotioncs: element.NUMPROMOTIONCS, 
                taux_ecrit_lang: element.TAUX_ORAL_LANG, 
                taux_oral_lang: element.TAUX_ORAL_LANG, 
                taux_cc_lang: element.TAUX_CC_LANG,
                module_fantome: element.MODULE_FANTOME,
                nbre_ds: element.NBRE_DS,
                existe_colle: element.EXISTE_COLLE,
                designation_module: element.DESIGNATION_MODULE,
                 
                
                
             });
                              console.log('iam here');
  
                             console.log(element.FIRSTNAME);
          }, this);
          response.json(employees)["metaData"];
          
          
        });
    });
  });
  

  


  router.route('/ennew/:etudiant').get(  async function  (request, response){

    console.log("GET EMPLOYEES");
    oracledb.getConnection(connectionProperties, async function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
       }
       const {etudiant} = request.params
 
     const query = `SELECT * FROM ESP_NOTE_NEW WHERE id_et = :etudiant`;
     const result = await connection.execute(query, { etudiant });
     console.log(result);
     if(result.rows.length != 0){
 
       var note=[];
       for (var count =0 ; count <result.rows.length; count++)
       {
         m = result.rows[count];
         console.log(m[1]);
         var mo =m[1]
         const query1 = `SELECT confirmation FROM ESP_entete_note_new WHERE CODE_MODULE = :mo`;
         const result1 = await connection.execute(query1, { mo });
        console.log(result1.rows);
 
         if(result1.rows == 'y'){
           console.log(m);
           
           note.push(m);
             
           
         }
       }
       response.send("note.rows");
       return note;
     }
  });
   });
   
  
  
  
  

  }
  module.exports = {run}
  