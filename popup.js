// Affiche le nombre d'images IA bloquées (par défaut 0)
document.addEventListener('DOMContentLoaded', function() {
	// Ici, tu pourras récupérer le vrai nombre depuis le storage ou background
	let count = 0; // Valeur par défaut
	document.getElementById('ia-blocked-count').textContent = count;
});