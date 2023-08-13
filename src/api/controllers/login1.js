
var oracledb = require('oracledb');
const jwt = require("jsonwebtoken");
const config = require("./../../config/config");
const bcrypt = require('bcrypt');


async function run(router,connectionProperties,upload) {



/**
 * login
 */
router.post('/login',async function(request,response, next){
  var email = request.body.email;
  var pwd = request.body.password;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pwd, salt);
  pass = hash;
  console.log(pass);
  let connection;
  
  connection = await oracledb.getConnection(connectionProperties); 
 

    if(email.length != 0 && pwd.length !=0){

        const q = `SELECT * FROM ESP_USER WHERE email = :email  `;
        const r = await connection.execute(q,{email});
        if(r.rows >0){
            console.log(r.rows)
            for(var count =0;count<r.rows.length;count++){

                if(bcrypt.compare(r[r.rows[count].length-2,pass])){
                    
                    if(r[r.length-1] == "01"){
                        const query = `SELECT * FROM ESP_ETUDIANT WHERE email = :email`;
                        const result = await connection.execute(query, { email });
                        const user = result.rows[0];
                        let token = jwt.sign({email: request.body.email,role:request.body.role},config.key,{
                            expiresIn: "24H",
                        });
                         console.log('logged in');
                         response.status(200).json({
                           token: token,
                           user: user,
                           role:r[r.length-1],
                           msg: "success",});

                    } if(r[r.length-1] == "02"){
                        const query = `SELECT * FROM ESP_ENSEIGNANT WHERE email = :email`;
                        const result = await connection.execute(query, { email });
                        const user = result.rows[0];
                        let token = jwt.sign({email: request.body.email,role:request.body.role},config.key,{
                            expiresIn: "24H",
                        });
                         console.log('logged in');
                         response.status(200).json({
                           token: token,
                           user: user,
                           role:r[r.length-1],
                           msg: "success",});    

                    } if(r[r.length-1] == "03"){
                        const query = `SELECT * FROM ESP_ADMIN WHERE email = :email`;
                        const result = await connection.execute(query, { email });
                        const user = result.rows[0];
                        let token = jwt.sign({email: request.body.email,role:request.body.role},config.key,{
                            expiresIn: "24H",
                        });
                         console.log('logged in');
                         response.status(200).json({
                           token: token,
                           user: user,
                           role:r[r.length-1],
                           msg: "success",});
                    }
                    
                    
                }
            }

        }
    }
    else{
        return response.send("Invalid Credentials");
    }
});
  






}






module.exports = {run}


