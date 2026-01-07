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

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('block-ai-images');

  // Charger l’état sauvegardé
  chrome.storage.sync.get(['aiBlockEnabled'], (res) => {
    toggle.checked = res.aiBlockEnabled ?? false;
  });

  // Quand on clique sur le bouton
  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;

    // Sauvegarde l’état
    chrome.storage.sync.set({ aiBlockEnabled: enabled });

    // Envoie l’ordre à la page active
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "TOGGLE_AI_BLUR",
        enabled: enabled
      });
    });
  });
});
