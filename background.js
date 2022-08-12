
var activeVideos = {};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    console.log("background.js got a message")
    
    if(request==="READY" && activeVideos.hasOwnProperty(sender.tab.id)){

        // The content script on the other side is ready
        sendResponse("NEWVID");

    }

});

chrome.tabs.onUpdated.addListener((tabid, cinfo, tab)=>{

    if(tab.url && tab.url.includes("youtube.com/watch")){

        const params = tab.url.split("?")[1];
        const urlparams = new URLSearchParams(params);

        activeVideos[tabid] = {
            type : "NEWVID",
            id : urlparams.get("v")
        }
        
    }
});
chrome.runtime.onInstalled.addListener((reason) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    
        // WHen the user firsts install the extensions
        chrome.tabs.create({
            url: 'about.html'
        });

    }
});