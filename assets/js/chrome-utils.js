/*

    This module main consists of functions which are used to interact
    with the CHROME storage API, such as delete a record or adding a record
    or fixing/updating a record to a new value...

*/

import {reset_videofull} from "./bind-events.js";

export function AddPageEmptyMessage(){

    // Invoke this when the #content element has no children

    $("#content").append(`
    <div class="empty">
        <img src="assets/img/empty.png" title="Empty results.">
        <label>No video found.</label>
    </div>
    `);
}

export const db = "video-list";
// Name of the database / key inside the chrome storage API.

export function extract_all_videos(f){

    // Extracting all of the currently added videos inside the chrome storage and give them back
    // under the form of an array

    chrome.storage.sync.get(["video-list"], (e)=>{f( Object.values(e)[0] );});

}
export const getTime = t =>{

    // Given an amount of seconds, it is gonna convert it
    // to a representative string of time in HH:MM:SS format.

    var date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substr(11,8);
}

export function get_video_info(id, f){

    /*

        Extracting all of the information about a specific video based
        on the given video's id ( id in this case ), it is gonna pass
        the information of that video to the callback function f(...)

        id : the video's id
        f : the callback function

    */

    chrome.storage.sync.get(["video-list"], (e)=>{

        let l = Object.values(e)[0];

        if(l.videos===undefined || l.order.length==0)
            return;

        f(l.videos[[id]]);
    
    });

}

export function DeleteVideoById(id_, f){

    /*

        Delete a video record out of the storage based on the
        id_ being provided, after being deleted, the f(..) callback
        function will be called.

        id_ : id of the video
        f : callback function

    */

    // Delete a video record out of the storage

    chrome.storage.sync.get(["video-list"], (e)=>{

        let data = Object.values(e)[0];

        data.order.splice(data.order.indexOf(id_), 1);
        
        delete data.videos[id_];

        chrome.storage.sync.set({["video-list"]:data}, f);

    });

}

export function ChangeBookMarkDescription(vidid, mark, content){

    /*

        Changing the description of a bookmark based on the given
        "vidid" ( as the id of the video ) and the mark ( id of the bookmark )
        and change its original content to "content"

        vidid : id of the video
        mark : id of the bookmark of that video
        content : the new content.

    */

    chrome.storage.sync.get(["video-list"], (e)=>{

        let data = Object.values(e)[0];
        // Grab the god damn video
        let bookmarks = data.videos[vidid].bookmarks;
        // The name of the variable already explained itself

        bookmarks[[mark]].description = content;

        chrome.storage.sync.set({["video-list"]:data});

    });

}

export function DeleteBookMarkByVideoID(vidid, mark, execute_at_the_end){

    /*

        This function is used to delete a specific bookmark
        out of a video

        vidid : id of the video
        mark : id of the bookmark of that video
        execute_at_the_end : 

    */

    chrome.storage.sync.get(["video-list"], (e)=>{

        let data = Object.values(e)[0];
        // Grab the god damn video
        let bookmarks = data.videos[vidid].bookmarks;
        // The name of the variable already explained itself

        delete bookmarks[[mark]];

        chrome.storage.sync.set({["video-list"]:data} , ()=>{

            execute_at_the_end();

        });

    });

}

function GetVideosOnPage(p, f){

    /*

        Extracting a 10 pages when the user select page "p",
        the arguments will be passed to the callback function
        which is f(...) in this case.

        p : the current page we wish to query
        f : the callback function

    */

    chrome.storage.sync.get(["video-list"], (e)=>{

        const data = Object.values(e)[0];
        let temp = data.order;
        
        f({
            v : temp.splice( (p-1)*10, p*10 ),
            all : data.videos
        });

    });

}


export function ResetContentPage(f){

    /*

        This function is commonly used when the user deletes a specific
        video, it is going to re-calculate the amount of pages and 
        do some rendering to reset the #content section on the page.

    */

    chrome.storage.sync.get([db], (ret)=>{

        let length = Object.values(ret)[0].order.length;

        let total = Math.ceil( length / 10 );
        // Total page on the popup page
        let c_page = parseInt($("#currentpage").html());
        // Current page the user is on

        if(c_page>total)
            // The total amount of pages has been reduced much lower than the current page the user is 
            // staying on. Time to reset #currentpage to the equal value of #totalpage
            c_page = total

        $("#totalpage").html(total);           
        $("#currentpage").html(c_page);

        if(total===0)
            AddPageEmptyMessage();
        else
            AddVideoContentByPage(c_page, true);
            // GetVideosOnPage
    });

}

export function CalculatePage(index, f){

    /*

        This function base on the "index" being provided and it will
        calculate the current page that "index" is staying on and also
        what is the index of that element inside the calculated page ?

        index : index of the element as a whole in the entire order array
        f     : Callback function

        Returns : [int, int]
                --> int[0] : The page the element is staying on, if it doesn't exist, return -1
                --> int[1] : The index of the element inside that page

    */

    chrome.storage.sync.get([db], (e)=>{

        console.log(index);

        const length = Object.values(e)[0].order.length; // Getting the length of orders
        const totalpage = Math.ceil(length/10);          // Calculate the total amount of pages
        const current_page = Math.ceil((index+1)/10);    // The current page that "index" stays on
        const p_index = (index+1)%10==0 ? 9 : (index%10); // Getting the index of the element in the new page

        if(current_page>totalpage)
            return [-1,-1] // Invalid result
            
        f([current_page, p_index]);

    });

}


export function ResetCurrentPage(p){

    /*

        Resetting the bottom section which holds the informatoin about 
        what page we are standing on and what is the total amount of 
        pages that exists.

        p => The page that we are currently standing on rn

        Results : if "p" is valid, it is gonna reset it, if not it is going to ignore it

    */

    chrome.storage.sync.get([db], (ret)=>{

        const totalpage = Object.values(ret)[0].order.length;

        $("#totalpage").html( Math.ceil(totalpage/10) );

        if(p>totalpage)return;

        $("#currentpage").html(p);

    });


}

export function AddVideoContentByPage(page, is_normal, clicked_index){

    /*

        Adding the data of a specific page being requested by the user
        and reset the content on the #content section inside the DOM
        to that data

        page : the page the user wishes to extract and reset to
        is_normal : if it's true then there won't be any fade-in animation
                    to the newly added videos, if false then yes.
        clicked_index : if it's true then the index at "clicked_index" will 
                        be added with a new "clicked" class.

    */

    $('#content').html("");

    GetVideosOnPage(page, (videos)=>{

        const {v, all} = videos; 

        v.forEach((e, index, arr) => {

            let vid = all[e];

            $("#content").append(`
            <div class="youtube-videos ${is_normal ? '' : 'vidmark-anime'} vid-hover" id="${e}">
                <img src="${vid[["img"]]}">
                <label id="title">${vid[["title"]]}</label>
                <a id="link">${vid[["url"]]}</a>
                <label id="bcount">Bookmarks : ${ Object.keys(vid[["bookmarks"]]).length }</label>
            </div>
            `);

        });

        setTimeout(()=>{

            // Removing initial animation class for .youtube-videos
            // <div> to avoid them being broken later after being hovered
            // over.
        
            $(".youtube-videos").removeClass("vidmark-anime");
        
        }, 1000);

        reset_videofull();


        if(clicked_index!==undefined){

            // Reclick the element after being refreshed

            const e = document.getElementById("content").children[clicked_index];

            e.click();

            e.scrollIntoView({block: "center", inline: "nearest"});

        }

    });

}



export function clear_storage(){

    // CLearing all of the data inside the storage

    chrome.storage.sync.clear();
}

