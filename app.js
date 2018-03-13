/*Configuration d'express*/
const express = require('express');
const cookieParser = require('cookie-parser');
var app = express();

/*Permet d'ajouter la librairie socket.io*/
const server = require('http').createServer(app);
const io = require('./mes_modules/chat_socket').listen(server);

app.use(cookieParser());

app.use(express.static('public'));

/*Configuration de body parser*/
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

/* on associe le moteur de vue au module «ejs» */
app.set('view engine', 'ejs'); // générateur de template
const MongoClient = require('mongodb').MongoClient;

/*Permet d'accéder à l’index  automatique  « _id »*/
const ObjectID = require('mongodb').ObjectID;

/*on associe le moteur de vue au module «ejs»*/
const util = require("util");

app.use(express.static('public'));
const i18n = require('i18n');
i18n.configure({
	locales : ['fr', 'en'],
	cookie : 'langueChoisie',
	directory : __dirname + '/locales' });

app.use(i18n.init);

let db // variable qui contiendra le lien sur la BD

/*Permet d'accéder à la boucle de peuplement*/
const peupler = require("./mes_modules/peupler/index.js");

////////////////////////////////// route accueil
/*app.get('/', function (req, res) {
	// affiche le contenu du gabarit accueil
	res.render('accueil.ejs');
})*/

app.get('/:lang(en|fr)', function (req, res) {
	console.log("req.params.local = " + req.params.lang)
	res.cookie('langueChoisie', req.params.lang)
	res.setLocale(req.params.lang)
	console.log(res.__('courriel'))
	res.redirect('back');
});

app.get('/', function (req, res) {
	console.log("req.cookies.langueChoisie = " + req.cookies.langueChoisie)
	console.log(res.__('courriel'))
	res.render('accueil.ejs')
});

////////////////////////////////// route adresses
app.get('/adresse', function (req, res) {
	var cursor = db.collection('adresse').find().toArray(function(err, resultat){
		if (err) return console.log(err)
		var util = require("util");
 		console.log('util = ' + util.inspect(resultat));
		// affiche le contenu de la BD
		res.render('composants/adresses.ejs', {adresses: resultat})
	}) 
})

////////////////////////////////// route formulaire
app.get('/formulaire', function (req, res) {
	// affiche le contenu du gabarit accueil
	res.render('gabarit-formulaire.ejs');
})

//////////////////////////////// route ajouter et modifier
app.post('/ajouter', (req, res) => {
	console.log(req.body._id)
	if(req.body._id ==""){
		console.log("nouveau");
		let objet ={
			nom:req.body.nom,
			prenom:req.body.prenom,
			courriel: req.body.courriel,
			telephone:req.body.telephone
		}
		db.collection('adresse').save(objet, (err, result) => {
		if (err) return console.log(err)
			console.log('sauvegarder dans la BD')
			res.redirect('/adresse')
		})
	}else{
		console.log("modifier");
		let objet = {
			_id: ObjectID(req.body._id),
			nom:req.body.nom,
			prenom:req.body.prenom,
			courriel: req.body.courriel,
			telephone:req.body.telephone
		}
		db.collection('adresse').save(objet, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/adresse')
	})
	}
	
})

//////////////////////////////// route supprimer
app.get('/delete/:id', (req, res) => {
	var id = req.params.id 
	var critere = ObjectID(req.params.id)
	console.log(critere)

	console.log(id)
	db.collection('adresse').findOneAndDelete({"_id": critere}, (err, resultat) => {
		if (err) return console.log(err)
		res.redirect('/adresse')
	})
})

//////////////////////////////// route trier
app.get('/trier/:cle/:ordre', (req, res) => {
	let cle = req.params.cle
	let ordre = (req.params.ordre == 'asc' ? 1 : -1)
	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat){
		ordre = (req.params.ordre == 'asc' ? 'desc' : 'asc')
		res.render('composants/adresses.ejs', {adresses: resultat, cle, ordre})
	})
})

//////////////////////////////// route peupler
app.get('/peupler', (req,res) => {
	res.resultat = peupler(); 
	console.log('début boucle') 
	for (let elm of res.resultat) {
		db.collection('adresse').save(elm, (err, result) => {
		if (err) return console.log(err)
	 	console.log('sauvegarder dans la BD')
		})
	}
	console.log('fin boucle')
	res.redirect('/adresse')
})

//////////////////////////////// route vider
app.get('/vider', (req, res) => {
	db.collection('adresse').drop();
 	res.redirect('/adresse');
})

//////////////////////////////// route chat
app.get('/chat', (req, res) => {
	res.render('socket_vue.ejs');
})

/*Connexion à la base de données MongoDB*/
MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
	if (err) return console.log(err)
	db = database.db('carnet_adresse')
	// lancement du serveur Express sur le port 8081
	server.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081')
	})
})