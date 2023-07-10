//web service import
const user = require('./src/api/controllers/user');
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
entete_note.run(router,connectionProperties); 
r1.run(router,connectionProperties); 
inscription.run(router,connectionProperties); 
