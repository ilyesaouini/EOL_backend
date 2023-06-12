
var oracledb = require('oracledb');
const jwt = require("jsonwebtoken");
const config = require("./../../config/config");
const bcrypt = require('bcrypt');
async function run(router,connectionProperties,upload) {

/**
 * GET / 
 * Returns a list of employees 
 */
router.route('/employees/').get(function (request, response) {
  console.log("GET EMPLOYEES");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    console.log("After connection");
    connection.execute("SELECT * FROM employee",{},
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
          employees.push({ id: element.ID, firstName: element.FIRSTNAME, 
                           lastName: element.LASTNAME, email: element.EMAIL, 
                           phone: element.PHONE, birthDate: element.BIRTHDATE, 
                           title: element.TITLE, dept: element.DEPARTMENT,
                           password: element.PASSWORD,image: element.IMAGE });
                            console.log('iam here');

                           console.log(element.FIRSTNAME);
        }, this);
        response.json(employees)["metaData"];
        
        
      });
  });
});

  
  /**
   * POST / 
   * Saves a new employee 
   */
  router.route('/employees/').post(function (request, response) {
    console.log("POST EMPLOYEE:");
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
  
      connection.execute("INSERT INTO EMPLOYEE (ID, FIRSTNAME, LASTNAME, EMAIL, PHONE, BIRTHDATE, TITLE, DEPARTMENT, PASSWORD)"+ 
                         "VALUES(EMPLOYEE_SEQ.NEXTVAL, :firstName,:lastName,:email,:phone,:birthdate,:title,:department, :password)",
        [body.firstName, body.lastName, body.email, body.phone, body.birthDate, body.title,  body.dept, body.password],
        function (err, result) {
          if (err) {
            console.error(err.message);
            response.status(500).send("Error saving employee to DB");
            doRelease(connection);
            return;
          }
          response.end();
          
        });
    });
  });
  
  
/**
 * PUT / 
 * Update a employee 
 */


router.route('/employees/:id').put(function (request, response) {
  console.log("PUT EMPLOYEE:");
  oracledb.getConnection(connectionProperties, function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    var body = request.body;
    var id = request.params.id;

    connection.execute("UPDATE EMPLOYEE SET FIRSTNAME=:firstName, LASTNAME=:lastName, PHONE=:phone, BIRTHDATE=:birthdate,"+
                       " TITLE=:title, DEPARTMENT=:department, EMAIL=:email WHERE ID=:id",
      [body.firstName, body.lastName,body.phone, body.birthDate, body.title, body.dept, body.email,  id],
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
/**
 * PUT / 
 * Update a employee 
 */


router.route('/registre').patch(function (request, response) {
  console.log("PUT EMPLOYEE:");
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    var body = request.body;
    var email = request.body.email;
    const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(body.password, salt);
      body.password = hash;
      var role = request.body.role;
      if(role =="student"){

    connection.execute("UPDATE EMPLOYEE SET PASSWORD=:password WHERE Email=:email",
      [body.password, email],
      async function (err, result) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error updating employee to DB");
          doRelease(connection);
          return;
        }

        let token = jwt.sign({email: request.body.email},config.key,{
          expiresIn: "24H",});
          const query = `SELECT * FROM employee WHERE email = :email`;
  const usr = await connection.execute(query, { email });
  const reg = usr.rows[0];
          console.log('logged in');
      response.status(200).json({
        token: token,
        user: reg,
        msg: "success",});
        response.end();
        
      });
    }
  });
});


/**
 * update image
 */

router.route('/image/').patch(function (request, response) {
  console.log("PUT EMPLOYEE:");
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    var body = request.body;
    var id = request.body.id;
    

    connection.execute("UPDATE EMPLOYEE SET IMAGE=:image WHERE ID=:id",
      [request.body.image,  id],
      function (err, result) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error updating employee to DB");
          
          return;
        }
        response.end();
        
      });
  });
});



// 


  /**
   * DELETE / 
   * Delete a employee 
   */
  router.route('/employees/:id').delete(function (request, response) {
    console.log("DELETE EMPLOYEE ID:"+request.params.id);
    oracledb.getConnection(connectionProperties, function (err, connection) {
      if (err) {
        console.error(err.message);
        response.status(500).send("Error connecting to DB");
        return;
      }

      
  
      var body = request.body;
      var id = request.params.id;
      connection.execute("DELETE FROM EMPLOYEE WHERE ID = :id",
        [id],
        function (err, result) {
          if (err) {
            console.error(err.message);
            response.status(500).send("Error deleting employee to DB");
            doRelease(connection);
            return;
          }
          response.end();
          
        });
    });
  });


  //get by id
  router.get('/employees/:id', async (req, res) => {
    const { id } = req.params;
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(connectionProperties);
  
      const query = `SELECT * FROM employee WHERE id = :id`;
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
  //get by mail
  router.get('/employees/:email', async (req, res) => {
    const { id } = req.params;
  
    let connection;
  
    try {
      connection = await oracledb.getConnection(connectionProperties);
  
      const query = `SELECT password FROM employee WHERE email = :email`;
      const result = await connection.execute(query, { email });
  
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
 * login
 
 router.post('/login',async function(request,response, next){
  var email = request.body.email;
  var pwd = request.body.password;

  let connection;
  
  connection = await oracledb.getConnection(connectionProperties);  
  const query = `SELECT * FROM employee WHERE email = :email`;
  const result = await connection.execute(query, { email });

  if( email.length !==0 && pwd.length !== 0){
     if(result.rows.length > 0){

  const user = result.rows[0];
  console.log(pwd);
  const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pwd, salt);
      pass = hash;
      console.log(pass);
  console.log(user[user.length -2]);

  passs = user[user.length-2]
   for (var count =0 ; count <result.rows.length; count++)
   {
     if ( bcrypt.compare(user[user.length -2],pwd)){
           
        let token = jwt.sign({email: request.body.email},config.key,{
         expiresIn: "24H",
     });
      console.log('logged in');
      response.status(200).json({
        token: token,
        user: user,
        msg: "success",});
        
            
     }else{
   return response.send('incorrect password');
     }
   }
     }else{
       return response.send('incorrect mail');
     }

   }else{
    return response.send('mail and pwd must not empty');
   }
  

 });
 
 */


}



module.exports = {run}

















