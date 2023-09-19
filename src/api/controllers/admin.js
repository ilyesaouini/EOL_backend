
var oracledb = require('oracledb');
const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');


async function run(router,connectionProperties,uploadimage) {


    /**
       * POST / 
       * Saves a new employee 
       */
    router.route('/admin/').post(function (request, response) {
        console.log("POST ADMIN:");
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
      
          connection.execute("INSERT INTO ESP_ADMIN (ID_ADMIN, NOM_PRENOM, NOM,PRENOM, EMAIL, TEL,PASSWORD,ROLE)"+ 
                             "VALUES(:id_etudiant, :nom_prenom,:nom,:prenom,:email,:tel, :password,:role)",
            [body.id_etudiant, body.nom_prenom, body.nom, body.prenom, body.email, body.tel,  body.password,body.role],
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
    router.route('/admins/').get(function (request, response) {
      console.log("GET EMPLOYEES");
      oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error connecting to DB");
          return;
        }
        console.log("After connection");
        connection.execute("SELECT * FROM esp_admin",{},
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
                               password: element.PASSWORD,image: element.IMAGE,
                           role: element.ROLE });
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
    
    
    router.route('/admin/:id').put(function (request, response) {
      console.log("PUT ADMIN:");
      oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error connecting to DB");
          return;
        }
    
        var body = request.body;
        var id = request.params.id;
    
        connection.execute("UPDATE ESP_ADMIN SET NOM_PRENOM=:nom_prenom, NOM=:nom, PRENOM=:prenom, EMAIL=:email,"+
                           " DATE_DE_NAISSANCE=:date_de_naissance, TEL=:tel,ROLE=:role,  WHERE ID_ETUDIANT=:id",
          [body.nom_prenom, body.nom,body.prenom, body.email, body.date_de_naissance, body.tel,body.role,  id],
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
    router.get('/admin/:id', async (req, res) => {
      const { id } = req.params;
    
      let connection;
    
      try {
        connection = await oracledb.getConnection(connectionProperties);
    
        const query = `SELECT * FROM ESP_ADMIN WHERE ID_ADMIN = :id`;
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
     router.route('/eadmin/:id').delete(function (request, response) {
      console.log("DELETE EMPLOYEE ID:"+request.params.id);
      oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error connecting to DB");
          return;
        }
    
        
    
        var body = request.body;
        var id = request.params.id;
        connection.execute("DELETE FROM ESP_ADMIN WHERE ID_ADMIN = :id",
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
    
    
    /**
     * 
     * registre etudiant
     */
    router.route('/registereadmin').patch(function (request, response) {
      console.log("Register:");
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
    
        connection.execute("UPDATE ESP_ADMIN SET PASSWORD=:password WHERE Email=:email",
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
              const query = `SELECT * FROM ESP_ADMIN WHERE email = :email`;
      const usr = await connection.execute(query, { email });
      const reg = usr.rows[0];
              console.log('logged in');
          response.status(200).json({
            token: token,
            user: reg,
            msg: "success",});
            response.end();
            
          });
      });
    });
    
    
    
    
    
    /**
     * login
     */
    router.post('/loginadmin',async function(request,response, next){
      var email = request.body.email;
      var pwd = request.body.password;
    
      let connection;
      
      connection = await oracledb.getConnection(connectionProperties);  
      const query = `SELECT * FROM ESP_ADMIN WHERE email = :email`;
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
    
    }
    
module.exports = {run}
