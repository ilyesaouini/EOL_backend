
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
  
  let connection;
  
  connection = await oracledb.getConnection(connectionProperties); 
  
  if(email.length !==0 && pwd.length !==0)
  {
    const q = `SELECT * FROM ESP_USER WHERE email = :email  `;
    const r = await connection.execute(q,{email});
    if(r.rows.length >0){
      console.log(r.rows[0]);
      
      w = r.rows[0];
      console.log(w[w.length]);
      console.log(w[w.length-2]);
      
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pwd, salt);
      pass = hash;
      console.log(pass);
      if(bcrypt.compare(w[w.length-2],pwd)){
      if(w[w.length-1] =="01"){
            const query = `SELECT * FROM ESP_ETUDIANT WHERE email = :email`;
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
        console.log(w[w.length-1]);
        if ( bcrypt.compare(user[user.length -2],pwd)){
          
          let token = jwt.sign({email: request.body.email,role: request.body.role},config.key,{
            expiresIn: "24H",
         });
          console.log('logged in');
          response.status(200).json({
            token: token,
            user: user,
            role:w[w.length-1],
            msg: "success",});
            console.log(user);
            
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
      
    }
    else if(w[w.length-1] == "02"){
      
        const query = `SELECT * FROM ESP_ENSEIGNANT WHERE email = :email`;
        const result = await connection.execute(query, { email });
        
        if( email.length !==0 && pwd.length !== 0){
          if(result.rows.length > 0){
            
            const user = result.rows[0];
            const Role = w[w.length-1];
            console.log(pwd);
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(pwd, salt);
            pass = hash;
            console.log(pass);
            console.log(user[user.length -2]);
            console.log(user);
            
            passs = user[user.length-2]
            for (var count =0 ; count <result.rows.length; count++)
            {
              if ( bcrypt.compare(user[user.length -4],pwd)){
                
                let token = jwt.sign({email: request.body.email,role:request.body.role},config.key,{
                  expiresIn: "24H",
                });
                console.log('logged in');
                response.status(200).json({
            token: token,
            user: user,
            role:Role,
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
    
  }
  else if(w[w.length-1] == "03"){
    
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
            
            let token = jwt.sign({email: request.body.email,role:request.body.role},config.key,{
               expiresIn: "24H",
           });
            console.log('logged in');
            response.status(200).json({
              token: token,
              user: user,
              role:w[w.length-1],
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
    }
    
  }
  else
  {
    console.log('error')
  }
}
  }
});





router.post('/login1',async function(request,response, next){

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
    
    for (var count = 0; count< u.length;count ++){
      user= r.rows[0];
      console.log("user: "+ user);

      if(bcrypt.compareSync(pwd,user[user.length-2],function(err, result) {
        // result == true
    })){
      if(user[user.length-1=="01"]){
        const query = `SELECT * FROM ESP_ETUDIANT WHERE email = :email`;
            const result = await connection.execute(query, { email });
            const etudiant = result.rows[0];

            let token = jwt.sign({email: request.body.email,role:user[user.length-1]},config.key,{
              expiresIn: "24H",
          });
          console.log('logged in');
          response.status(200).send(token).json({
            token: token,
            user: etudiant,
            role:user[user.length-1],
            msg: "success",});
      }
    }
    }
    
    
    }

    
  }

})




}






module.exports = {run}


