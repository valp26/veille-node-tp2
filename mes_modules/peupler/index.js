"use strict";
const tableau = require('./tableaux.js');

/*variable contenant le nombre d'éléments dans chaque tableau*/
const maxNom = tableau.nom.length;
const maxPrenom = tableau.prenom.length;
const maxPrefixeTel = tableau.prefixeTel.length;
const maxDomaine = tableau.domaine.length;

/*Permet de générer des membres aléatoirement*/
const peupler = () => {
	let generationMembres = [];

	/*Génération de 10 membres dans un tableau*/
	for (var i = 0; i < 10; i++) {

		/*Génération du nom*/
		let position = Math.floor(Math.random()*maxNom);
		let nom = tableau.nom[position];

		/*Génération du prénom*/
		position = Math.floor(Math.random()*maxPrenom);
		let prenom = tableau.prenom[position];

		/*Génération du téléphone*/
		position = Math.floor(Math.random()*maxPrefixeTel);
		let prefixeTel = tableau.prefixeTel[position];
		let telephone = prefixeTel + '-';
		for (let k=0; k<3; k++) {
			telephone += Math.floor(Math.random()*9);
		}
		telephone += '-';
		for (let k=0; k<4; k++) {
			telephone += Math.floor(Math.random()*9);
		}

		/*Génération du courriel*/
		position = Math.floor(Math.random()*maxDomaine);
		let domaine = tableau.domaine[position];
		let courriel = prenom +'.'+ nom + domaine;

		/*Création de l'objet membre à généré*/
		let membre = {
			nom : nom,
			prenom : prenom,
			telephone : telephone,
			courriel : courriel
		}

		generationMembres.push(membre);
	}

	return generationMembres;
}

module.exports = peupler;