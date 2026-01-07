// Gère l'affichage du compteur et l'état des boutons
document.addEventListener('DOMContentLoaded', function() {
	// Affiche le compteur
	function updateCount() {
		chrome.storage.sync.get(['blockedCount'], (result) => {
			document.getElementById('ia-blocked-count').textContent = result.blockedCount || 0;
		});
	}
	updateCount();
	// Mets à jour le compteur en temps réel
	chrome.storage.onChanged.addListener((changes, area) => {
		if (area === 'sync' && changes.blockedCount) updateCount();
	});

	// Gère le bouton de blocage IA
	const blockAICheck = document.getElementById('block-ai-images');
	chrome.storage.sync.get(['blockAI'], (result) => {
		blockAICheck.checked = result.blockAI === true;
	});
	blockAICheck.addEventListener('change', (e) => {
		chrome.storage.sync.set({ blockAI: e.target.checked });
	});

	// Gère le bouton "autre fonctionnalité"
	const otherCheck = document.getElementById('other-feature');
	chrome.storage.sync.get(['otherFeature'], (result) => {
		otherCheck.checked = result.otherFeature === true;
	});
	otherCheck.addEventListener('change', (e) => {
		chrome.storage.sync.set({ otherFeature: e.target.checked });
	});
});