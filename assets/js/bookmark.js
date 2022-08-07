
import { 
    get_video_info, 
    getTime,
    ChangeBookMarkDescription,
    DeleteBookMarkByVideoID
} from "./chrome-utils.js";

function AddEmptyPage(){
    $("#content").append(`
    <div class="empty">
        <img src="assets/img/empty_bookmark.png" title="Empty results.">
        <label>No bookmarks found.</label>
    </div>
    `);
}

$("#back > img").ready(()=>{

    // #back > img : Used to return back to the popup page

    $("#back > img").on("click", ()=>{

        window.location.href = "/popup.html";
        
    });

});

function bindBookMarkEvents(){

    /*

        When all of the necessary elements are finished putting and loading
        into th DOM, call this function to bind some handler to them through
        some specific events such as "click" or remove certain classes to 
        get rid of redudant animation which has finished.

        CLASSES :
            -> outer-bookmark : The wrapper classes of .bookmark

            -> bookmark : The section containing the data about a specific bookmark

            -> tasks : Each bookmark will have its own action buttons which allows actions such as :
                    + Deleting the bookmark
                    + Updating the content of the boomark
                    + Browsing the bookmark
                This class is used to hold all of those action buttons

    */
    
    $(".outer-bookmark").ready(()=>{
        setTimeout(()=>{
            $(".outer-bookmark").removeClass("init-bookmark");
        }, 600);
    })

    $(".bookmark").bind({

        // Class definitions :
    
        /*
    
            + show_timeline : SHowing the section which shows the timestamp that the user saves back 
            + hide_timeline : Undo the above tasks ^
            + unload_tasks : Loading and unloading all of the features available on a bookmark ( delete + browse )
    
        */
    
        mouseenter : function(e){
    
            // WHen a user move their mouse over a certain bookmark.
    
            let t = e.currentTarget;
            let timeline = t.children[0];
            let tasks = t.children[2];
    
            timeline.classList.add("hide_timeline");
            timeline.classList.remove("show_timeline");
            // Showing timeline when a hover action is made
    
            tasks.style.display = "flex";
            
    
        },
    
        mouseleave : function(e){
    
            // When their moouse leaves a bookmark after hovering over it.
    
            let t = e.currentTarget;
            let timeline = t.children[0];
            let tasks = t.children[2];
    
            timeline.classList.remove("hide_timeline");
            timeline.classList.add("show_timeline");
            // Showing timeline when a hover action is made
    
            tasks.classList.add("unload-tasks");
            tasks.classList.remove("unload-tasks");
            // Showing the tasks which the user can interact with the bookmark and also hiding it
            // available tasks such as : "delete" and "browse"
    
            tasks.style.display = "none";
    
            
        },
    
        dblclick : function(e){
    
            // Browse to the video's timestamp
    
            $(".tasks > div > img:nth-child(1)").click();
        
        }
    
    });

    $(".tasks").ready(()=>{

        const delete_popup_html = `
        <div class="delete">
            <label>Do you wish to delete this bookmark ?</label>
            <div>
                <img src="assets/img/confirm.png" title="Confirm delete.">
                <img src="assets/img/cancel.png" title="Cancel delete.">
            </div>
        </div>
        `;
        const videoid = $("#youtube-link")[0].innerHTML.split("?v=")[1];
    
        $(".tasks > div > img:nth-child(1)").bind("click", (e)=>{
            // Browsing the link
    
    
            let headline = $(e.currentTarget.parentNode.parentNode.parentNode).find("h3").html().trim();
            let t = headline.split(":");
            let second = 0;
    
            while(t.length!=3){
                // Fully qualifed HH:MM:SS
                t.unshift("00");
            }
    
            t.forEach((element, index, fullArray) => {
                if(index==0)
                    second += parseInt(element)*3600;
                else if(index==1)
                    second += parseInt(element)*60
                else
                    second += parseInt(element)
            });
    
            window.open(`${$("#youtube-link")[0].innerHTML}&t=${second}`);
    
        });
    
        $(".tasks > div > img:nth-child(2)").bind("click", (e)=>{
            // Deleting the bookmark
    
            let bookmark = $(e.currentTarget.parentNode.parentNode.parentNode);
            let outerbookmark = $(bookmark.parents()[0]);
    
            bookmark.css("display", "none");
    
            outerbookmark.append(delete_popup_html);
    
            $(".delete").ready(()=>{
    
                $(".delete img:nth-child(1)").bind("click", (e)=>{
                    
                    // Accept delet

                    const id = e.currentTarget. // <img src="assets/img/confirm.png" title="Confirm delete.">
                        parentElement.          // <div id="2">…</div>
                        parentElement.          // <div class="delete">…</div>flex
                        parentElement.          // <div class="outer-bookmark" id="init-bookmark">…</div>flex
                        getElementsByClassName("time show_timeline")[0]. // <div class="time show_timeline">…</div>flex
                        children[0].innerHTML; // <h3>TIMESTAMP_HERE</h3>
                    
                    // ID of the video which currently stores the bookmarks

                    DeleteBookMarkByVideoID(videoid, id,()=>{

                        outerbookmark.children().last().remove();
    
                        bookmark.css("display", "flex");

                        outerbookmark.addClass("bmark-got-deleted");

                        setTimeout(()=>{

                            outerbookmark.remove();

                            if($("#content")[0].children.length==0){

                                AddEmptyPage();
                                // After deleting a specific bookmark and there is no more content inside 
                                // #content, better off mark it as "Empty" through the invoking of AddEmptyPage();

                            }

                        }, 700);

                    })
                    

                });
                
    
                $(".delete img:nth-child(2)").bind("click", (e)=>{
    
                    // Cancel delete
                    outerbookmark.children().last().remove();
    
                    bookmark.css("display", "flex");
    
                });
                
    
            });
        });
    
        $(".tasks > div > img:nth-child(3)").bind("click", (e)=>{
            

            let bookmark = $(e.currentTarget.parentNode.parentNode.parentNode)[0].getElementsByClassName("details")[0].children[0];
            // Grabbing the foking bookmark
            let content = bookmark.innerHTML.trim();
            // Getting the current content of the bookmark
        
            // When user clicks on a boomark
    
            const textbox = `
            <div class="expanded-mark">
                <textarea>${content}</textarea>
                <button>Save</button>
            </div>
            `;
            const current_div = e.currentTarget.parentElement.parentElement.parentElement.parentElement;
            const Jcurrent_div = $(current_div);
    
    
            current_div.classList.add("expand-bookmark");
            // expand-bookmark = provide the animation to expand the current bookmark
            // into another interface for the user to manage their own notes.
    
            Jcurrent_div.children().last().css("visibility", "hidden");
            // Making the current child element inside the bookmark hidden to make room 
            // for the later element to appear on top of everything.
    
            Jcurrent_div.append(textbox);
            // Adding the textbox HTML data in order to create a textarea for the user
            // to view the notes and also provide them with features to manage/edit
            // their own notes.
    
            $("#content").css("overflow", "hidden");
    
            $(".expanded-mark > button").bind("click", (e)=>{

                const new_content = Jcurrent_div[0].getElementsByTagName("textarea")[0].value.trim();
                
                const mark = e.currentTarget.
                    parentElement.                                  // <div class="expanded-mark">…</div>flex
                    parentElement.                                  // <div class="outer-bookmark expand-bookmark" id="init-bookmark">…</div>flex
                    getElementsByClassName("time show_timeline")[0].// <div class="time show_timeline">…</div>flex
                    children[0].                                    // <h3>00:10:31</h3>
                    innerHTML;                                      // MAIN CONTENT
    
                if(new_content!==content){

                    // The content is new, time to change stuffs

                    bookmark.innerHTML = new_content;

                    ChangeBookMarkDescription(videoid, mark, new_content);

                }

                $("#content").css("overflow", "auto");
    
                Jcurrent_div.children().last().remove();
                // Removing the textbox out of the current <div>
    
                Jcurrent_div.children().last().css("visibility", "visible");
                // Making the previous data inside the current <div> visible again
    
                current_div.classList.remove("expand-bookmark");
                // Getting rid of the expand-bookmark class to make the <div> normal
                // again

    
            });
    
        });
    
    })  

}

const openlink = ()=>{

    // shortcut for opening the link associating with a certain bookmark.

    let url = $("#youtube-link")[0].innerHTML;
    window.open(url, "_blank");
}

$("#youtube-link").ready(()=>{

    $("#youtube-link").on("click", openlink);

})

$("#notification").ready(()=>{

    $("#notification img").on("click", openlink);

})




let id_ = window.location.href.split("?id=")[1].trim();

get_video_info(id_, (e)=>{

    let duration = getTime(e[["fulltime"]]);

    $("#video-text").text(e[["title"]]);
    // Title of the youtube video
    $("#youtube-link").text(e[["url"]]);
    // Link to the youtube video
    $("#duration").text(duration);
    // The duration of the video
    $("#totalmarks").text(Object.keys(e[["bookmarks"]]).length);
    // The total number of available bookmarks in this video

    if(Object.keys(e.bookmarks).length==0){

        AddEmptyPage();

    }else{

        Object.keys(e.bookmarks).forEach((timestamp,i,arr)=>{

            $("#content").append(`

            <div class="outer-bookmark" id="init-bookmark">
                <div class="bookmark">
                    <div class="time">
                        <h3>${timestamp}</h3>
                    </div>
                    <div class="details">
                        <p>${e.bookmarks[[timestamp]][["description"]]}</p>
                    </div>
                    <div class="tasks">
                        <div class="load-tasks">
                            <img src="assets/img/openlink.png" title="Browse clip.">
                            <img src="assets/img/delete.png" title="Delete bookmark.">
                            <img src="assets/img/edit.png" title="View and update the bookmark.">
                        </div>
                    </div>
                </div>
            </div>

            `);

        });

    }

    bindBookMarkEvents();

});
