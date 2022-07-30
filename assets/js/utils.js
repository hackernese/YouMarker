

function extract_all_videos(f){

    // Extracting all of the currently added videos inside the chrome storage and give them back
    // under the form of an array

    chrome.storage.sync.get(["video-list"], (e)=>{f( Object.values(e)[0] );});

}
const getTime = t =>{
    var date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substr(11,8);
}

function get_video_info(id, f){

    chrome.storage.sync.get(["video-list"], (e)=>{

        let l = Object.values(e)[0];

        if(l.videos===undefined || l.order.length==0)
            return;

        f(l.videos[[id]]);
    
    });

}

function DeleteVideoById(id_){

    // Delete a video record out of the storage

    chrome.storage.sync.get(["video-list"], (e)=>{

        let data = Object.values(e)[0];

        data.order.splice(data.order.indexOf(id_), 1);
        
        delete data.videos[id_];

        chrome.storage.sync.set({["video-list"]:data});

    });

}

function GetVideosOnPage(p, f){

    chrome.storage.sync.get(["video-list"], (e)=>{

        let temp = Object.values(e)[0].order;
        
        f(temp.splice( (p-1)*10, p*10 ));

    });

}

function cleanTimeStamp(timestamp){

    let temp = timestamp.split(":");
    let final = [];


}

function clear_storage(){
    chrome.storage.sync.clear();
}

