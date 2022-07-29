

function bindBookMarkEvents(){
    
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
                <img src="assets/img/confirm.png" title="Confirm delete." value="id">
                <img src="assets/img/cancel.png" title="Cancel delete.">
            </div>
        </div>
        `;
    
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
    
                });
                // Accept delete
    
                $(".delete img:nth-child(2)").bind("click", (e)=>{
    
                    // Cancel delete
                    outerbookmark.children().last().remove();
    
                    bookmark.css("display", "flex");
    
                });
                
    
            });
        });
    
        $(".tasks > div > img:nth-child(3)").bind("click", (e)=>{
    
        
            // When user clicks on a boomark
    
            const textbox = `
            <div class="expanded-mark">
                <textarea>asdsadsadsad</textarea>
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

    $("#back > img").ready(()=>{

        $("#back > img").on("click", ()=>{

            window.location.href = "/popup.html";
            
        });

    });

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




$(document).ready(()=>{

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

        console.log(e.bookmarks);

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

        bindBookMarkEvents();

    });

});