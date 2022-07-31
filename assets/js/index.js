const bookmarks = document.getElementsByClassName("youtube-videos");
const pagenum = document.getElementById("page-num");
const actions = document.getElementById("actions-btns");
const db = "video-list";
var selected_mark, test, dragging;
 


setTimeout(()=>{

    // Removing initial animation class for .youtube-videos
    // <div> to avoid them being broken later after being hovered
    // over.

    $(".youtube-videos").removeClass("vidmark-anime");

}, 1000);


function reset_bookmark_pureHTML(e){
    e.classList.remove("vidclicked");
    e.classList.remove("clicked");
    e.classList.add("youtube-videos");
    e.classList.add("vid-hover");
    e.classList.remove("shrink");

    $("#actions-btns").css("display", "none");
    $("#page-num").css("display", "block");
}
function reset_bookmark(e){

    reset_bookmark_pureHTML(e.currentTarget);

}

function set_clicked_bookmark(event){
    event.currentTarget.classList.remove("youtube-videos");
    event.currentTarget.classList.remove("vid-hover");
    event.currentTarget.classList.add("clicked");
    event.currentTarget.classList.add("shrink");
    event.currentTarget.classList.add("vidclicked");

    $("#actions-btns").css("display", "flex");
    $("#page-num").css("display", "none");

    $("#actions-btns").addClass("tasks-bar");

    setTimeout(()=>{

        $("#actions-btns").removeClass("tasks-bar")

    }, 600);
}

$("#about").on("click", ()=>{
    $("#about").addClass("back-btn");
    $("#about").removeClass("about-hover");
})

function reset_videodbclick(){
    $(".youtube-videos").dblclick((e)=>{

        e.currentTarget.classList.add("fade_item_out__");
        
        $(".header").addClass("fade_out_header");
        $(".header div").addClass("fade_out_header");
        $(".header label").addClass("fade_out_header");
        $(".header #icon").addClass("fade_out_header");
        $("#content").addClass("fade_out_middle");
        $("#footer").addClass("fade_out_footer");

        e.currentTarget.addEventListener("animationend", ()=>{
            window.location.href = `/bookmark.html?id=${e.currentTarget.id}`;
        });

    })
}

function reset_videoclick(){
    $(".youtube-videos").bind("click", (event)=>{


        let div = event.currentTarget;

        let selected = $(".vidclicked");

        if(selected.length===0){

            // No div has been selected yet.

            set_clicked_bookmark(event);


        }else{

            // One div has been selected. Do something here

            // First check if the user has reclicked the selected div
            // if yes then unset it
            if(div==selected[0]){
                reset_bookmark(event);
                return;
            }

            reset_bookmark_pureHTML(selected[0]);

            set_clicked_bookmark(event);

        }


    });
}

function reset_videofull(){

    reset_videodbclick();
    reset_videoclick();

}

function nextprevButtonsBindEvent(){

    $("#next").bind("click", (e)=>{

        alert("Cool bean too, click next...");

    });
    $("#previous").bind("click", (e)=>{

        alert("Cool bean, click previous...");

    });

}

function BindClickEventActionBtn(){

    // Binding click events to action buttons such as "View",
    // "Delete" and "Notify", etc...

    $("#actions-btns img").bind("click", (e)=>{

        const video = $(".shrink")[0];
        const videoID = video.id;
        const action = e.currentTarget.id;

        if(action=='viewbtn'){
        
            // Viewing the video on a new tab

            window.open(video.children[2].innerHTML, "blank_");
        
        }else if(action=="deletebtn"){

            // Delete this video out of the storage
            DeleteVideoById(videoID);

            video.classList.add("deleted");

            setTimeout(()=>{

                video.remove();
                
                if($("#content").children().length===0)
                    AddPageEmptyMessage();

            }, 700);
        
        }else if(action=="notifybtn"){

            // OPen up the notifying setting in order to put a notification
            // onto this video 
        
            console.log(1);
        
        }


    });
}

function AddPageEmptyMessage(){

    // Invoke this when the #content element has no children

    $("#content").append(`
    <div class="empty">
        <img src="assets/img/empty.png" title="Empty results.">
        <label>No video found.</label>
    </div>
    `);
}

$(document).ready(()=>{

    $("#content").sortable({

        start : (e,ui)=>{

            ui.item.data("previous_pos", ui.item.index());
            // Setting the previous position before proceeding any further.

        },

        update : (e,ui)=>{
        
            // WHen the video was dragged to a new position
            // Change the storage here 
            const prev_pos = ui.item.data("previous_pos");
            const current_pos = ui.item.index();
            // The newly updated position of this current video item

            chrome.storage.sync.get([db], (e)=>{

                let temp = Object.values(e)[0];
                let temp_order = temp.order;
                // Temporary variable for the "order" attribute inside the 
                // chrome.storage.sync API

                let temp_id = temp_order[prev_pos];
                // Popping the current video's ID out of the storage's "order"
                // array and storing it inside a temporary variable first.

                temp_order.splice(prev_pos, 1);
                // Removing the value out after extracting its value.
                
                temp_order.splice(current_pos, 0, temp_id);
                // Inserting it into a new index, in this case it's 
                // "current_pos"

                chrome.storage.sync.set({[db]: temp});

            });

        }

    });

    $("#content").on("click", (event)=>{

        // When a user decides to click into the content section
        // THis usually means the user wants to click out of a 
        // selected video bookmark to un-bold it.        

        if (event.target !== event.currentTarget)
            return;

        if(selected_mark){

            reset_bookmark(selected_mark);

        }

    });


    extract_all_videos((ret)=>{

        if(ret===undefined || ret.order.length==0){
            
            AddPageEmptyMessage();
            $("#totalpage").text(0);
            $("#currentpage").text(0);

        }else{

            let totalpage = Math.ceil(ret.order.length/10);


            if(totalpage<=1){

                // If the amount of page is not enough to be paginated, ignore it 
                // and move on, also disable the next and previous buttons

                $("#next").removeClass("nextanime");
                $("#previous").removeClass("prevanime");

                $("#next").addClass("disabled");
                $("#previous").addClass("disabled");


                $("#next").css("transform", "translateX(0)");
                $("#next").css("cursor", "not-allowed");
                $("#previous").css("transform", "translateX(0)");
                $("#previous").css("cursor", "not-allowed");

            }else{

                setTimeout(()=>{

                    // Removing some initial classes for both the <div> 
                    // id=next and <div> with id=previous

                    $("#next").removeClass("nextanime");
                    $("#next").css("transform", "translateX(0)");

                    $("#previous").removeClass("prevanime");
                    $("#previous").css("transform", "translateX(0)");

                }, 500);

                nextprevButtonsBindEvent();

            }

            $("#totalpage").text(totalpage);
            $("#currentpage").text(1);

            GetVideosOnPage(1, (videos)=>{

                videos.forEach((e, index, arr) => {

                    let vid = ret.videos[e];
    
                    $("#content").append(`
                    <div class="youtube-videos vidmark-anime vid-hover" id="${e}">
                        <img src="${vid[["img"]]}">
                        <label id="title">${vid[["title"]]}</label>
                        <a id="link">${vid[["url"]]}</a>
                        <label id="bcount">Bookmarks : ${ Object.keys(vid[["bookmarks"]]).length }</label>
                    </div>
                    `);
    
                });
    
                reset_videofull();

            });

        }
        
    });

    BindClickEventActionBtn();
    // chrome.storage.sync.clear();
    
});