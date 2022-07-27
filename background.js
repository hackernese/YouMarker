chrome.tabs.onUpdated.addListener((tabid, cinfo, tab)=>{

    if(tab.url && tab.url.includes("youtube.com/watch")){

        const params = tab.url.split("?")[1];
        const urlparams = new URLSearchParams(params);

        chrome.tabs.sendMessage(tabid, {

            type : "NEWVID",
            id : urlparams.get("v")

        });
        
    }
});


chrome.runtime.onInstalled.addListener((reason) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    
        // WHen the user firsts install the extensions
        //   chrome.tabs.create({
    //     url: 'onboarding.html'
    //   });
    }
});