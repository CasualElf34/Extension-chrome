const API_USER = '1281723001'; 
const API_SECRET = 'oyNAPLh2uS6uxrPEBnJQ7WAYdUqotr59';

// Fonction pour bloquer une image
function blockImage(imgElement) {
    imgElement.style.filter = "blur(20px)"; // Floute l'image
    imgElement.style.transition = "0.5s";
    // On peut aussi remplacer la source par une image "Bloqué"
    imgElement.src = "https://via.placeholder.com/300x200?text=IMAGE+IA+BLOQUEE+PAR+HUMAN-GATE";
}

// Vérifier les images sur la page
async function checkImages() {
    chrome.storage.local.get(['blockAI'], async (result) => {
        if (!result.blockAI) return; // Si le switch est OFF, on ne fait rien

        const images = document.querySelectorAll('img:not(.hg-checked)');
        
        for (let img of images) {
            img.classList.add('hg-checked'); // Marquer pour ne pas scanner 2 fois
            
            const url = img.src;
            if (!url.startsWith('http')) continue;

            const apiUrl = `https://api.sightengine.com/1.0/check.json?url=${encodeURIComponent(url)}&models=genai&api_user=${API_USER}&api_secret=${API_SECRET}`;
            
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.type && data.type.ai_generated > 0.5) {
                    blockImage(img);
                    // On prévient le popup pour augmenter le compteur
                    chrome.runtime.sendMessage({type: "INCREMENT_COUNTER"});
                }
            } catch (e) { console.error("Erreur scan:", e); }
        }
    });
}

// Lancer le scan au chargement et au scroll
setInterval(checkImages, 3000);

let aiBlurEnabled = false;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "TOGGLE_AI_BLUR") {
    aiBlurEnabled = message.enabled;

    if (aiBlurEnabled) {
      scanAndBlurImages();
    } else {
      removeBlur();
    }
  }
});

const style = document.createElement("style");
style.textContent = `
  .ai-blur {
    filter: blur(20px);
    transition: filter 0.3s ease;
  }
`;
document.head.appendChild(style);

function removeBlur() {
  document.querySelectorAll(".ai-blur").forEach(img => {
    img.classList.remove("ai-blur");
  });
}

const observer = new MutationObserver(() => {
  if (aiBlurEnabled) scanAndBlurImages();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
