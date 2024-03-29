var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
var fs  = require('fs');
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true,parameterLimit:1000000,limit:"500mb"}));
var oracledb = require('oracledb');
oracledb.autoCommit = true;
//Set Request Size Limit

var connectionProperties = {
  user: process.env.DBAAS_USER_NAME || "admin",
  password: process.env.DBAAS_USER_PASSWORD || "admin",
  connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "localhost/xe"
};



// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(bodyParser.urlencoded({ extended: true,limit: '5mb' }));
//app.use(bodyParser.json({ type: '*/*',limit:'50mb' }));



var PORT = process.env.PORT || 8089;

var router = express.Router();


router.use(function (request, response, next) {
  console.log("REQUEST:" + request.method + "   " + request.url);
  console.log("BODY:" + JSON.stringify(request.body));
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  next();
});








/**
 * upload file
 */


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  })
  
  const uploadStorage = multer({ storage: storage })
  
  // Single file
  app.post("/upload/single", uploadStorage.single("file"), (req, res) => {
    console.log("POST ETUDIANT:");
    oracledb.getConnection(connectionProperties, async function (err, connection) {
        if (err) {
          console.error(err.message);
          response.status(500).send("Error connecting to DB");
          return;
        }
         
    console.log(req.file);
    console.log("==================================================");
    console.log("Current directory :", __dirname);
    console.log("==================================================");
    console.log("File path :", req.file.path);
    
        
        
    
        connection.execute("INSERT INTO ESP_EMPLOI (ID_EMPLOI, EMPLOI,NAME,TYPE)values " + 
        "(EMPLOI_SEQ.NEXTVAL, :emploi,:name,:type)",
          [ req.file.path, req.file.originalname,"pdf"],
          function (err, result) {
            if (err) {
              console.error(err.message);
              res.status(500).send("Error saving employee to DB");
              
              return;
            }
            res.end();
            
          });
      });
      
    return res.send("Single file uploaded")
  })
  
  //Multiple files
  app.post("/upload/multiple", uploadStorage.array("files", 10), (req, res) => {
    console.log(req.files)
    return res.send("Multiple files uploaded")
  })















//upload images

app.use('/images', express.static(path.join(__dirname, '/images')));


const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, req.body.image + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

  
const uploadimage = multer({ storage: storage1, fileFilter: fileFilter });






app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(express.static('static'));
app.use('/', router);
app.listen(PORT);


//web service import

const absence = require('./src/api/controllers/absence');
const admin = require('./src/api/controllers/admin');
const annee = require('./src/api/controllers/annee');
const classe = require('./src/api/controllers/classe');
const emploi = require('./src/api/controllers/emploi');
const etudiant = require('./src/api/controllers/etudiant');
const enseignant = require('./src/api/controllers/enseignant');
const module1 = require('./src/api/controllers/module');
const note = require('./src/api/controllers/note');
const reclamation = require('./src/api/controllers/reclamtion');
const resultat = require('./src/api/controllers/resultat');
const login = require('./src/api/controllers/login');
const register = require('./src/api/controllers/register');
const entete_note = require('./src/api/controllers/entete_note');
const r1 = require('./src/api/controllers/r1');
const inscription = require('./src/api/controllers/inscription');
const absencenew = require('./src/api/controllers/absencenew');
const entete_notenew = require('./src/api/controllers/entete_notenew');
const notenew = require('./src/api/controllers/notenew');
const panier = require('./src/api/controllers/panier');
const login1 = require('./src/api/controllers/login1');
const parametre = require('./src/api/controllers/parametre');




//run
 
absence.run(router,connectionProperties); 
admin.run(router,connectionProperties,uploadimage); 
annee.run(router,connectionProperties); 
classe.run(router,connectionProperties); 
emploi.run(router,connectionProperties); 
etudiant.run(router,connectionProperties,uploadimage); 
enseignant.run(router,connectionProperties,uploadimage); 
module1.run(router,connectionProperties); 
note.run(router,connectionProperties);
reclamation.run(router,connectionProperties); 
resultat.run(router,connectionProperties); 
login.run(router,connectionProperties); 
register.run(router,connectionProperties); 
entete_note.run(router,connectionProperties); 
r1.run(router,connectionProperties); 
inscription.run(router,connectionProperties); 
absencenew.run(router,connectionProperties);
entete_notenew.run(router,connectionProperties);
notenew.run(router,connectionProperties);
panier.run(router,connectionProperties);
login1.run(router,connectionProperties);
parametre.run(router,connectionProperties); 


