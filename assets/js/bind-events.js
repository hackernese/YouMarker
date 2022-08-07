
/* 

    The primary goal of this module is to contain handlers and functions
    which can be used to bind a specific event to a specific element
    inside the DOM

*/

import {
    ResetBottomActionButtons,
    ResetBottomActionButtonsJQuery
} from "./footer.js";

import {
    ResetContentPage,
    DeleteVideoById
} from "./chrome-utils.js";

export function ResetVideodbclick(){

    /* 
    
        Binding "double click" ( dbclick ) event to the 
        class "youtube-videos"

    */
 
    $(".youtube-videos").dblclick((e)=>{

        e.currentTarget.classList.add("fade_item_out__");
        
        $(".header").addClass("fade_out_header");
        $(".header div").addClass("fade_out_header");
        $(".header label").addClass("fade_out_header");
        $(".header #icon").addClass("fade_out_header");
        $("#content").addClass("fade_out_middle");
        $("#footer").addClass("fade_out_footer");

        // Add some class to build a fade-out affect in CSS

        e.currentTarget.addEventListener("animationend", ()=>{

            window.location.href = `/bookmark.html?id=${e.currentTarget.id}`;
            // After the animation has ended, redirect to a different
            // URL which is /bookmark.html in this case and set id= the current id
            // of the specified video mark.

        });

    })
}

export function ResetVideoSingleClick(){

    /*

        Bind a single click event ( click ) to the class
        "youtube-videos" inside the DOM.

    */

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
                ResetBottomActionButtonsJQuery(event);
                return;
            }

            ResetBottomActionButtons(selected[0]);

            set_clicked_bookmark(event);

        }


    });
}


export function BindClickEventActionBtn(){

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
            DeleteVideoById(videoID, ()=>{

                ResetBottomActionButtons(video);

                video.classList.add("deleted");

                setTimeout(()=>{

                    video.remove();

                    ResetContentPage();

                }, 700);

            });
        
        }else if(action=="notifybtn"){

            // OPen up the notifying setting in order to put a notification
            // onto this video 
        
            console.log(1);
        
        }

    });
}

export function nextprevButtonsBindEvent(){

    /*

        Binding a click event to the "next" and "previous" buttons 
        inside the DOM

    */

    $("#next").bind("click", (e)=>{
        
        // Next button binding

        let total_page = parseInt($("#totalpage").html());
        let current_page = parseInt($("#currentpage").html());

        let new_page = current_page+1;

        if(current_page+1 > total_page)

            // This means it's already at the end of the last page
        
            return;


        AddVideoContentByPage(new_page);
        $("#currentpage").html(new_page);
    

    });
    $("#previous").bind("click", (e)=>{

        // Previous button binding

        // let total_page = parseInt($("#totalpage").html());
        let current_page = parseInt($("#currentpage").html());

        let new_page = current_page-1;

        if(current_page==1)

            // This means it's already the first page
        
            return;

        
        AddVideoContentByPage(new_page);
        $("#currentpage").html(new_page);

    });

}


function set_clicked_bookmark(event){

    // When a single click is performed onto a "youtube-videos" class
    // This function will run and do some of the following stuffs

    event.currentTarget.classList.remove("youtube-videos");
    event.currentTarget.classList.remove("vid-hover");
    // Removing the hovering affect and also the styling of "youtube-videos"

    event.currentTarget.classList.add("clicked");
    // Adding the styling of class "clicked"

    event.currentTarget.classList.add("shrink");
    // Adding the styling of class "shrink"

    event.currentTarget.classList.add("vidclicked");
    // Adding the styling of class "vidclicked"


    $("#actions-btns").css("display", "flex"); // Displaying the three action buttons
    $("#page-num").css("display", "none");     // Hiding the page number section 
    $("#actions-btns").addClass("tasks-bar");  // Adding the styling of "tasks-bar" to the action buttons

    setTimeout(()=>{

        $("#actions-btns").removeClass("tasks-bar")
        // Removing the affect of the animation inside the 
        // tasks-bar CSS rule.

    }, 600);
}


export function reset_videofull(){

    /*

        Instead of setting a double click and single click event
        one at a time, using this function will set both of them
        at the same time.

    */

    ResetVideodbclick();
    ResetVideoSingleClick();

}