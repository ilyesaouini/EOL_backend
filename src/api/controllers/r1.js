var oracledb = require('oracledb');
const jwt = require("jsonwebtoken");
const config = require("./../../config/config");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const axios = require('axios');
async function run(router,connectionProperties,upload) {

  
router.route('/register1').patch(function (request, response) {
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

        if(email.length !==0 )
  {
    const q = `SELECT * FROM ESP_USER WHERE email = :email  `;
    const r = await connection.execute(q,{email});
    console.log('result',r.rows);
    console.log('result',r.rows[0]);
    
    if(r.rows.password == null){

      let token = jwt.sign({email: request.body.email, hash},config.key,{
        expiresIn: "1H",});
      sendMail("http://192.168.1.240:8089/modifier/"+r.rows[0][0],hash,email.toString());

       //const r1 = await axios.patch('http://localhost:8089/modifier/'+r.rows[0][0]+'/'+hash);
       //console.log(r1);
      
    if(r.rows.role = "01"){
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
            
            const query = `SELECT * FROM ESP_ETUDIANT WHERE email = :email`;
    const usr = await connection.execute(query, { email });
    const reg = usr.rows[0][0];
    console.log("aaa"+reg);
            console.log('logged in');
        response.status(200).json({
          token: token,
          user: reg,
          msg: "success",});
          response.end();
          
        });

    }
    
    }

  }

        
    });

});

/*------------------EXTRA FUNCTIONS----------------*/
//verification

router.route('/verify/:id/:password').patch(function (request, response) {
  console.log("PUT EMPLOYEE:");
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
  
    
  
  
  })
})


router.route('/modifier/').patch(function (request, response) {
  console.log("PUT EMPLOYEE:");
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }

    var password = request.body.password;
    var id = request.body.id;
    

    connection.execute("UPDATE ESP_USER SET PASSWORD=:password WHERE ID=:id",
      [password,  id],
      function (err, result) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error updating employee to DB");
          
          return;
        }
        console.log("sss");
        response.end();
        
      });
  });
});


function sendMail(confirm,cofirm1,email) {
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


/*
router.patch('/verify/:id/:password', async (req, res) => {
  let us= req.body;
  oracledb.getConnection(connectionProperties, async function (err, connection) {
    if (err) {
      console.error(err.message);
      response.status(500).send("Error connecting to DB");
      return;
    }
    //mysqlConnection.query('SELECT * FROM token WHERE token = ?', [req.params.id], (err1, usrows, fields) => {
      
      connection.execute('SELECT * FROM esp_user WHERE id = ?', [req.params.id], (err1, usrows, fields) => {
        console.log(usrows[0])
        if(usrows[0])
        connection.execute("Update esp_user PASSWORD=:password WHERE id = ?", [ req.params.password,req.params.id], (err, rows, fields) => {
          if (!err)
          {
            usrows[0].password= req.params.password;
            //res.send(usrows);
            res.send("{\"State\":\"0\"}")
            
          }
          else
          console.log(err);
        })
      })
    });
});

*/