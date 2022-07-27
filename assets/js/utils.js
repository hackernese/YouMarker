

function extract_all_videos(f){

    // Extracting all of the currently added videos inside the chrome storage and give them back
    // under the form of an array

    chrome.storage.sync.get(["videos"], (e)=>{f(e)});

}

function extract_all_data(f){
    
    // Extracting basically everything including all of the bookmarks and also the array containing 
    // the videos which had already been added.

    chrome.storage.sync.get(null, function(items) {f(Object.keys(items));});

}

function clear_storage(){
    chrome.storage.sync.clear();
}

