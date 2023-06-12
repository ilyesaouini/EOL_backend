;
var oracledb = require('oracledb');
const jwt = require("jsonwebtoken");
const config = require("./../../config/config");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

async function run(router,connectionProperties,upload) {

  
router.route('/register').patch(function (request, response) {
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
  
      connection.execute("UPDATE ESP_ETUDIANT SET PASSWORD=:password WHERE Email=:email",
        [body.password, email],
        async function (err, result) {
          if (err) {
            console.error(err.message);
            response.status(500).send("Error updating employee to DB");
            
            return;
          }
          
          let token = jwt.sign({email: request.body.email},config.key,{
            expiresIn: "24H",});
            sendMail("http://192.168.1.240:8089/verify/"+token,email.toString());
            const query = `SELECT * FROM ESP_ETUDIANT WHERE email = :email`;
    const usr = await connection.execute(query, { email });
    const reg = usr.rows[0];
    console.log("aaa"+reg);
            console.log('logged in');
        response.status(200).json({
          token: token,
          user: reg,
          msg: "success",});
          response.end();
          
        });
      }else if(role="instructor"){
        connection.execute("UPDATE ESP_ENSEIGNANT SET PASSWORD=:password WHERE Email=:email",
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
            sendMail("http://192.168.1.240:8089/verify/"+token,email.toString());
            const query = `SELECT * FROM ESP_ENSEIGNANT WHERE email = :email`;
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
      else if(role="admin"){
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
            sendMail("http://192.168.1.240:8089/verify/"+token,email.toString());
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
      }
    });
  });
  



  function sendMail(confirm,email) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'ilyesslawini@gmail.com',
        pass: 'dsipmqcignhgsria'
        }
    });

    var mailOptions = {
      from: 'ilyesslawini@gmail.com',
      to: email,
      subject: 'Proceed Email Confirmation!',
      text: 'Thank you for subscribing to EOL you did very well by choosing us dear client, we really appreciate it.\n Will you please verify your email now by clicking on this link: '+confirm
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

}  



module.exports = {run}