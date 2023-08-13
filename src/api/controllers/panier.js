
var oracledb = require('oracledb');
const axios = require('axios');
const { checkToken } = require('../middlewares/middleware');
const { request } = require('express');

async function run(router,connectionProperties,u) {


  
  
  
  
  
  
  /**
   * GET / 
   * Returns a list of employees 
   */
  router.route('/paniers/').get(function (request, response) {
    console.log("GET EMPLOYEES");
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }
      console.log("After connection");
      connection.execute("SELECT * FROM ESP_MODULE_PANIER_CLASSE_SAISO",{},
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
                description: element.DESCRIPTION, 
                nb_heures: element.NB_HEURES, 
                coef: element.COEF, 
                num_semestre: element.NUM_SEMESTRE, 
                num_periode: element.NUM_PERIODE, 
                date_debut: element.DATE_DEBUT, 
                date_fin: element.DATE_FIN, 
                date_examen: element.DATE_EXAMEN, 
                nbr_horaire_realises: element.NBR_HORAIRE_REALISES, 
                acomptabiliseur: element.ACOMPTABILISEUR, 
                id_ens: element.ID_ENS, 
                id_ens2: element.ID_ENS2, 
                nbr_heures_ens: element.NBR_HEURES_ENS, 
                nbr_heures_ens2: element.NBR_HEURES_ENS2, 
                surveillant: element.SURVEILLANT, 
                heure_exam: element.HEURE_EXAM, 
                salle_exam: element.SALLE_EXAM, 
                surveillant2: element.SURVEILLANT2, 
                salle_exam2: element.SALLE_EXAM2, 
                periode: element.PERIODE, 
                numpromotioncs: element.NUMPROMOTIONCS, 
                ap_cs: element.AP_CS, 
                charge_p1: element.CHARGE_P1, 
                charge_p2: element.CHARGE_P2, 
                charge_ens1_p1: element.CHARGE_ENS1_P1, 
                charge_ens1_p2: element.CHARGE_ENS1_P2, 
                charge_ens2_p1: element.CHARGE_ENS2_P1, 
                charge_ens2_p2: element.CHARGE_ENS2_P2, 
                seance_unique: element.SEANCE_UNIQUE, 
                id_ens3: element.ID_ENS3,
                id_ens4: element.ID_ENS4,
                id_ens5: element.ID_ENS5,
                charge_ens3_p1: element.CHARGE_ENS3_P1, 
                charge_ens3_p2: element.CHARGE_ENS3_P2, 
                charge_ens4_p1: element.CHARGE_ENS4_P1, 
                charge_ens4_p2: element.CHARGE_ENS4_P2, 
                charge_ens5_p1: element.CHARGE_ENS5_P1, 
                charge_ens5_p2: element.CHARGE_ENS5_P2, 
                code_ue: element.CODE_UE, 
                nbr_etcs: element.NBR_ETCS, 
                type_epreuve: element.TYPE_EPREUVE, 
                salle: element.SALLE, 
                type_ens: element.TYPE_ENS, 
                type_epreuve_sr: element.TYPE_EPREUVE_SR, 
                date_rattrapage: element.DATE_RATTRAPAGE, 
                heure_rat: element.HEURE_RAT, 
                salle1_ratt: element.SALLE1_RATT, 
                salle2_ratt: element.SALLE2_RATT, 
                date_rat: element.DATE_RAT, 
                date_creation: element.DATE_CREATION, 
                date_last_maj: element.DATE_LAST_MAJ, 
                designation_new: element.DESIGNATION_NEW, 
                chargep1add: element.CHARGEP1ADD, 
                chargep2add: element.CHARGEP2ADD,
                code_plan:element.CODE_PLAN, 
                nbheuradd: element.NBHEURADD, 
                calcul_rat: element.CALCUL_RAT,
                existe_cc: element.EXISTE_CC, 
                existe_tp: element.EXISTE_TP, 
                code_ue: element.CODE_UE, 
                heur_fin_sp: element.HEURE_FIN_SP, 
                heure_fin_sr: element.HEURE_FIN_SR, 
                ue_fantome: element.UE_FANTOME, 
                utilisateur: element.UTILISATEUR, 
                actif: element.ACTIF, 
                contact: element.CONTACT, 
                id_ens6: element.ID_ENS6, 
                charge_ens6_p1: element.CHARGE_ENS6_P1, 
                charge_ens6_p2: element.CHARGE_ENS6_P2, 
                observation: element.OBSERVATION, 
                coef_mine_pont: element.COEF_MINE_PONT, 

                
                
                
                
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
 router.route('/paniers_ens/:id').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    const { id } = request.params;
    connection.execute("SELECT * FROM ESP_MODULE_PANIER_CLASSE_SAISO WHERE ID_ENS = :id",{id},
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
              description: element.DESCRIPTION, 
              nb_heures: element.NB_HEURES, 
              coef: element.COEF, 
              num_semestre: element.NUM_SEMESTRE, 
              num_periode: element.NUM_PERIODE, 
              date_debut: element.DATE_DEBUT, 
              date_fin: element.DATE_FIN, 
              date_examen: element.DATE_EXAMEN, 
              nbr_horaire_realises: element.NBR_HORAIRE_REALISES, 
              acomptabiliseur: element.ACOMPTABILISEUR, 
              id_ens: element.ID_ENS, 
              id_ens2: element.ID_ENS2, 
              nbr_heures_ens: element.NBR_HEURES_ENS, 
              nbr_heures_ens2: element.NBR_HEURES_ENS2, 
              surveillant: element.SURVEILLANT, 
              heure_exam: element.HEURE_EXAM, 
              salle_exam: element.SALLE_EXAM, 
              surveillant2: element.SURVEILLANT2, 
              salle_exam2: element.SALLE_EXAM2, 
              periode: element.PERIODE, 
              numpromotioncs: element.NUMPROMOTIONCS, 
              ap_cs: element.AP_CS, 
              charge_p1: element.CHARGE_P1, 
              charge_p2: element.CHARGE_P2, 
              charge_ens1_p1: element.CHARGE_ENS1_P1, 
              charge_ens1_p2: element.CHARGE_ENS1_P2, 
              charge_ens2_p1: element.CHARGE_ENS2_P1, 
              charge_ens2_p2: element.CHARGE_ENS2_P2, 
              seance_unique: element.SEANCE_UNIQUE, 
              id_ens3: element.ID_ENS3,
              id_ens4: element.ID_ENS4,
              id_ens5: element.ID_ENS5,
              charge_ens3_p1: element.CHARGE_ENS3_P1, 
              charge_ens3_p2: element.CHARGE_ENS3_P2, 
              charge_ens4_p1: element.CHARGE_ENS4_P1, 
              charge_ens4_p2: element.CHARGE_ENS4_P2, 
              charge_ens5_p1: element.CHARGE_ENS5_P1, 
              charge_ens5_p2: element.CHARGE_ENS5_P2, 
              code_ue: element.CODE_UE, 
              nbr_etcs: element.NBR_ETCS, 
              type_epreuve: element.TYPE_EPREUVE, 
              salle: element.SALLE, 
              type_ens: element.TYPE_ENS, 
              type_epreuve_sr: element.TYPE_EPREUVE_SR, 
              date_rattrapage: element.DATE_RATTRAPAGE, 
              heure_rat: element.HEURE_RAT, 
              salle1_ratt: element.SALLE1_RATT, 
              salle2_ratt: element.SALLE2_RATT, 
              date_rat: element.DATE_RAT, 
              date_creation: element.DATE_CREATION, 
              date_last_maj: element.DATE_LAST_MAJ, 
              designation_new: element.DESIGNATION_NEW, 
              chargep1add: element.CHARGEP1ADD, 
              chargep2add: element.CHARGEP2ADD,
              code_plan:element.CODE_PLAN, 
              nbheuradd: element.NBHEURADD, 
              calcul_rat: element.CALCUL_RAT,
              existe_cc: element.EXISTE_CC, 
              existe_tp: element.EXISTE_TP, 
              code_ue: element.CODE_UE, 
              heur_fin_sp: element.HEURE_FIN_SP, 
              heure_fin_sr: element.HEURE_FIN_SR, 
              ue_fantome: element.UE_FANTOME, 
              utilisateur: element.UTILISATEUR, 
              actif: element.ACTIF, 
              contact: element.CONTACT, 
              id_ens6: element.ID_ENS6, 
              charge_ens6_p1: element.CHARGE_ENS6_P1, 
              charge_ens6_p2: element.CHARGE_ENS6_P2, 
              observation: element.OBSERVATION, 
              coef_mine_pont: element.COEF_MINE_PONT, 

              
              
              
              
           });
                            console.log('iam here');

                           console.log(element.FIRSTNAME);
        }, this);
        response.status(200).json({
          panier : employees
        });
        
        
        
      });
  });
});



 
  
 
  

  



  
  
  
  

  }
  module.exports = {run}
  