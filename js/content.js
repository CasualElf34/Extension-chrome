// Content script : bloque les images IA selon l'état du bouton
const API_URL = 'https://api.aionot.com/analyze?url='; // API AI or Not

// Récupère l'état du blocage depuis le storage
function getBlockState() {
  return new Promise(resolve => {
    chrome.storage.sync.get(['blockAI'], (result) => {
      resolve(result.blockAI === true);
    });
  });
}

// Met à jour le compteur dans le storage
function incrementBlockedCount() {
  chrome.storage.sync.get(['blockedCount'], (result) => {
    const count = (result.blockedCount || 0) + 1;
    chrome.storage.sync.set({ blockedCount: count });
  });
}

// Vérifie si une image est IA via l'API AI or Not
function checkImageAI(url, imgElement) {
  fetch(API_URL + encodeURIComponent(url))
    .then(res => res.json())
    .then(data => {
      console.log('AI or Not result:', data, url); // DEBUG
      if (data && data.result === 'ai') {
        imgElement.style.filter = 'blur(20px)';
        imgElement.title = 'Image IA bloquée';
        incrementBlockedCount();
      }
    })
    .catch((err) => { console.error('API error', err); });
}

// Applique le blocage sur toutes les images
async function processImages() {
  const block = await getBlockState();
  if (!block) return;
  document.querySelectorAll('img').forEach(img => {
    if (img.src && !img.dataset.iaChecked) {
      img.dataset.iaChecked = '1';
      checkImageAI(img.src, img);
    }
  });
}

// Surveille les nouvelles images ajoutées
const observer = new MutationObserver(processImages);
observer.observe(document.body, { childList: true, subtree: true });

// Premier scan
processImages();

function checkImageAI(url, imgElement) {
  fetch(API_URL + encodeURIComponent(url))
    .then(res => res.json())
    .then(data => {
      console.log('AI or Not result:', data, url); // <-- Ajout pour debug
      if (data && data.result === 'ai') {
        imgElement.style.filter = 'blur(20px)';
        imgElement.title = 'Image IA bloquée';
        incrementBlockedCount();
      }
    })
    .catch(() => {});
}