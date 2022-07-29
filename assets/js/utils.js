

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

function cleanTimeStamp(timestamp){

    let temp = timestamp.split(":");
    let final = [];


}

function clear_storage(){
    chrome.storage.sync.clear();
}

