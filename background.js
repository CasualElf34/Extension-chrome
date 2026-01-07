const API_USER = '1281723001'; 
const API_SECRET = 'oyNAPLh2uS6uxrPEBnJQ7WAYdUqotr59';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scanImageia",
    title: "🛡️ Analyser avec HUMAN-GATE",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "scanImageia") {
    const imageUrl = info.srcUrl;
    
    // Notification de début
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => console.log("Lancement de l'analyse Human-Gate...")
    });

    try {
      // Appel à l'API Sightengine via l'URL de l'image
      const apiUrl = `https://api.sightengine.com/1.0/check.json?url=${encodeURIComponent(imageUrl)}&models=genai&api_user=${API_USER}&api_secret=${API_SECRET}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      let message = "";
      if (data.type && data.type.ai_generated > 0.5) {
        const score = Math.round(data.type.ai_generated * 100);
        message = `🚨 ALERTE HUMAN-GATE : Cette image est générée par IA à ${score}% !`;
      } else {
        message = "✅ HUMAN-GATE : Cette image semble être une vraie photo humaine.";
      }

      // Affichage du résultat via une alerte sur la page
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (msg) => alert(msg),
        args: [message]
      });

    } catch (error) {
      console.error("Erreur:", error);
    }
  }
});