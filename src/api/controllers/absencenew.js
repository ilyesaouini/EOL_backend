const { json } = require('body-parser');
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
    const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', { month: 'short' });
}
m =   getMonthName(mm); 

const formattedToday = dd + '/' + m + '/' + yyyy;

    connection.execute("INSERT INTO ESP_ABSENCE_NEW (ID_ET,CODE_MODULE,CODE_CL,ANNEE_DEB,NUM_SEANCE,DATE_SEANCE,ID_ENS,DATE_SAISIE) values"+
  "(:ID_ET,:CODE_MODULE,:CODE_CL,:ANNEE_DEB,:NUM_SEANCE,:DATE_SEANCE,:ID_ENS,:DATE_SAISIE)",
  [body.ID_ET,body.CODE_MODULE,body.CODE_CL,body.ANNEE_DEB,body.NUM_SEANCE,formattedToday,body.ID_ENS,formattedToday],
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
        var dat =  Date.parse('dd/mm/yyy');
        console.log('iam heresss '+dat);
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


//get by id
router.get('/absenseignantclasse/:classe/:module/:id', async (req, res) => {
  const { id } = req.params;
  const { classe } = req.params;
  const { module } = req.params;

  let connection;

  console.log("GET ABSENCES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM esp_absence_new where code_cl = :classe and code_module =: module and id_ens=:id ",{classe,module,id},
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
       
        res.status(200).json({
          absence : employees
        });
        
        
      });
});
},)}

module.exports ={run}



