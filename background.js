chrome.tabs.onUpdated.addListener((tabid, tab)=>{

    if(tab.url && tab.url.includes("youtube.com/watch")){

        const params = tab.url.split("?")[1];
        const urlparams = new URLSearchParams(params);

        chrome.tabs.sendMessage(tabid, {
            type : "newvid",
            id : urlparams.get("v"),
            url : tab.url
        });

        // chrome.notifications.create(
        //     "new_tab_1",
        //     {
        //         type:'basic',
        //         iconUrl:chrome.runtime.getURL("assets/img/icon.png"),
        //         title : "YouMarker",
        //         message: "Yep",
        //         priority:1,
        //         buttons:[{
        //             title:'call'
        //                 },
        //                 {
        //                     title:''
        //                 }
        //         ],
        //         isClickable: true
        //     },
        //     ()=>{
        //         console.log(chrome.runtime.lastError);
        //     }
        // )

    }
});

chrome.runtime.onMessage.addListener((obj, sender, resp)=>{
 
    const {type, id, url} = obj;

    if(type==="ADDED"){
        
        // Loading the extension button into the video bar

        // chrome.notifications.create(
        //     options: {
                
        //     }
        // )

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