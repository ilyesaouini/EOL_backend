var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

var oracledb = require('oracledb');
oracledb.autoCommit = true;

var connectionProperties = {
  user: process.env.DBAAS_USER_NAME || "admin",
  password: process.env.DBAAS_USER_PASSWORD || "admin",
  connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "localhost/xe"
};

function doRelease(connection) {
  connection.release(function (err) {
    if (err) {
      console.error(err.message);
    }
  });
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true,limit: '5mb' }));
app.use(bodyParser.json({ type: '*/*',limit:'50mb' }));



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



//upload images

app.use('/images', express.static(path.join(__dirname, '/images')));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, req.body.image + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });


app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(express.static('static'));
app.use('/', router);
app.listen(PORT);


//web service import
const user = require('./user');
const absence = require('./absence');
const admin = require('./admin');
const annee = require('./annee');
const classe = require('./classe');
const emploi = require('./emploi');
const etudiant = require('./etudiant');
const enseignant = require('./enseignant');
const module1 = require('./module');
const note = require('./note');
const reclamation = require('./reclamtion');
const resultat = require('./resultat');
const login = require('./login');
const register = require('./register');


//run
user.run(router,connectionProperties,upload); 
absence.run(router,connectionProperties); 
admin.run(router,connectionProperties,upload); 
annee.run(router,connectionProperties); 
classe.run(router,connectionProperties); 
emploi.run(router,connectionProperties,upload); 
etudiant.run(router,connectionProperties,upload); 
enseignant.run(router,connectionProperties,upload); 
module1.run(router,connectionProperties); 
note.run(router,connectionProperties);
reclamation.run(router,connectionProperties); 
resultat.run(router,connectionProperties); 
login.run(router,connectionProperties); 
register.run(router,connectionProperties); 
