const bookmarks = document.getElementsByClassName("youtube-videos");
const pagenum = document.getElementById("page-num");
const actions = document.getElementById("actions-btns");
var selected_mark, test, dragging;


setTimeout(()=>{

    // Removing some initial classes for both the <div> 
    // id=next and <div> with id=previous

    $("#next").removeClass("nextanime");
    $("#next").css("transform", "translateX(0)");

    $("#previous").removeClass("prevanime");
    $("#previous").css("transform", "translateX(0)");

}, 500);

setTimeout(()=>{

    // Removing initial animation class for .youtube-videos
    // <div> to avoid them being broken later after being hovered
    // over.

    $(".youtube-videos").removeClass("vidmark-anime");

}, 1000);

function reset_bookmark(e){
    e.currentTarget.classList.remove("clicked");
    e.currentTarget.classList.add("youtube-videos");
    e.currentTarget.classList.add("vid-hover");
    e.currentTarget.classList.remove("shrink");

    $("#actions-btns").css("display", "none");
    $("#page-num").css("display", "block");

    selected_mark = index = undefined;
}

$("#about").on("click", ()=>{
    $("#about").addClass("back-btn");
    $("#about").removeClass("about-hover");
})


$(".youtube-videos").dblclick((e)=>{
    $(".header").addClass("fade_out_header");
    $(".header div").addClass("fade_out_header");
    $(".header label").addClass("fade_out_header");
    $(".header #icon").addClass("fade_out_header");

    $("#content").addClass("fade_out_middle");
    $("#footer").addClass("fade_out_footer");

    e.currentTarget.classList.add("fade_item_out");

    setTimeout(()=>{
        window.location.href = `/bookmark.html`; //?id=${e.currentTarget.id}`;
    }, 400);
    
})

$(document).ready(()=>{

    $("#content").sortable();

    $(".youtube-videos").bind("click", (event)=>{

        let last_child, now_child, index;

        if(selected_mark!==undefined){
            last_child = selected_mark.currentTarget;
            index = Array.from(last_child.parentNode.children).indexOf(last_child);
        }

        now_child = event.currentTarget;


        if(Array.from(now_child.parentNode.children).indexOf(now_child) == index){

            // User has already clicked it once, time to unset it


            reset_bookmark(event)

        }else{

            // User has never clicked it so it's time to check it
            if(selected_mark){

                // Unselect the previously selected video 
                reset_bookmark(selected_mark)

            }

            event.currentTarget.classList.remove("youtube-videos");
            event.currentTarget.classList.remove("vid-hover");
            event.currentTarget.classList.add("clicked");
            event.currentTarget.classList.add("shrink");

            $("#actions-btns").css("display", "flex");
            $("#page-num").css("display", "none");

            $("#actions-btns").addClass("tasks-bar");

            setTimeout(()=>{

                $("#actions-btns").removeClass("tasks-bar")

            }, 600);

            selected_mark = event;

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


        if(ret.key===undefined){
            
            $("#content").append(`
            <div class="empty">
                <img src="assets/img/empty.png" title="Empty results.">
                <label>No video found.</label>
            </div>
            `);

        }else{

            // ret.forEach((e, index, arr)=>{
            //     `
            //     <div class="youtube-videos vidmark-anime vid-hover" id="mark4">
            //         <img src="assets/img/test.png">
            //         <label id="title">7!! - Orange [Shigatsu wa Kimi no Uso ED 2] Lyrics</label>
            //         <a id="link">https://www.youtube.com/watch?v=JdSpuTi9d8A</a>
            //         <label id="bcount">Bookmarks : </label>
            //     </div>
            //     `;

            // });

        }
        
    });

    
});