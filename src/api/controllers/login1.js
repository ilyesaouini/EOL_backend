
var oracledb = require('oracledb');
const jwt = require("jsonwebtoken");
const config = require("./../../config/config");
const bcrypt = require('bcrypt');


async function run(router,connectionProperties,upload) {



/**
 * login
 */
router.post('/login2',async function(request,response, next){
    var pwd = request.body.password;
    var email = request.body.email;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pwd, salt);
  pass = hash;
  
  console.log(pass);
    connection = await oracledb.getConnection(connectionProperties); 
    if(email.length !==0 && pwd.length !==0)
    {
      const q = `SELECT * FROM ESP_USER WHERE email = :email  `;
      const r = await connection.execute(q,{email});
      u = r.rows[0];
      if(r.rows.length >0){
        console.log(r.rows[0]);
        console.log(u[u.length-2]);
      
      
        user= r.rows[0];
        console.log("user: "+ user);
  
        if(bcrypt.compareSync(pwd,user[user.length-2],function(err, result) {
          // result == true
      })){
          if(user[user.length-1]=="01"){
            console.log("gooooooooood ")
          const query = `SELECT * FROM ESP_ETUDIANT WHERE email = :email`;
              const result = await connection.execute(query, { email });
              const etudiant = result.rows[0];
  
              let token = jwt.sign({email: request.body.email,role:user[user.length-1]},config.key,{
                expiresIn: "24H",
            });
            console.log('logged in');
            response.status(200).json({
              token: token,
              user: etudiant,
              role:user[user.length-1],
              msg: "success",});
        }else if(user[user.length-1]=="02"){
            console.log("gooooooooood ")
          const query = `SELECT * FROM ESP_ENSEIGNANT WHERE email = :email`;
              const result = await connection.execute(query, { email });
              const etudiant = result.rows[0];
  
              let token = jwt.sign({email: request.body.email,role:user[user.length-1]},config.key,{
                expiresIn: "24H",
            });
            console.log('logged in');
            response.status(200).json({
              token: token,
              user: etudiant,
              role:user[user.length-1],
              msg: "success",});
        }else if(user[user.length-1]=="03"){
            console.log("gooooooooood ")
          const query = `SELECT * FROM ESP_ADMIN WHERE email = :email`;
              const result = await connection.execute(query, { email });
              const etudiant = result.rows[0];
  
              let token = jwt.sign({email: request.body.email,role:user[user.length-1]},config.key,{
                expiresIn: "24H",
            });
            console.log('logged in');
            response.status(200).json({
              token: token,
              user: etudiant,
              role:user[user.length-1],
              msg: "success",});
        }
      }else{
        response.send(" failed to login").status(203)
      }
      }
      
      
      
  
      
    }
  
    
});
  






}






module.exports = {run}


