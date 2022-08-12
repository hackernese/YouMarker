
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
    DeleteVideoById,
    db,
    AddVideoContentByPage,
    CalculatePage
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

        const video = $(".clicked")[0];
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
        
        }else if(action=="movedown"){

            chrome.storage.sync.get([db], (data)=>{

                let values = Object.values(data)[0].order;   // Getting the total list of all videos IDs
                let current_index = values.indexOf(videoID); // Extracting the current index inside that list
                let length = values.length;                  // Getting the length of the list

                if(current_index==length-1){
                    
                    // If the user wishes to move it downward
                    // but it's already at the end of the order list
                    // then this is invalid.

                    console.log("/* Already at the end of the list.");
                    return;
                }

                [
                    values[current_index], 
                    values[current_index+1] 
                ] = [
                    values[current_index+1], 
                    values[current_index] 
                ]
                // Swapping value of the current index and current index + 1
                
                CalculatePage(current_index+1, (ret)=>{

                    if(ret[0]==-1) return;

                    chrome.storage.sync.set({[db] : Object.values(data)[0]}, ()=>{

                        AddVideoContentByPage(ret[0], true, ret[1]);
    
                    });
    
                });

                

            });
        
        }else if(action=="moveup"){

            chrome.storage.sync.get([db], (data)=>{

                let values = Object.values(data)[0].order;   // Getting the total list of all videos IDs
                let current_index = values.indexOf(videoID); // Extracting the current index inside that list
                let length = values.length;                  // Getting the length of the list

                if(current_index==0){
                    
                    // If the user wishes to move it upward
                    // but it's already at the first index of the order list
                    // then this is invalid.

                    console.log("/* Already at the beginning of the list.");
                    return;
                }

                [ 
                    values[current_index], 
                    values[current_index-1] 
                ] = [
                    values[current_index-1], 
                    values[current_index] 
                ]
                // Swapping value of the current index and current index + 1

                CalculatePage(current_index-1, (ret)=>{
                    
                    if(ret[0]==-1) return;

                    chrome.storage.sync.set({[db] : Object.values(data)[0]}, ()=>{

                        AddVideoContentByPage(ret[0], true, ret[1]);
    
                    });
    
                });

                

            });

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


export function keystrokes_capture(){

    /*

        Recording keystrokes being performed on the DOM and see
        what to do with it

    */

    

    $(document).keydown((e)=>{

        const temp = $(".clicked");
        let citem=undefined,parent=undefined, index_item=undefined;

        if(temp.length>0){
            citem = temp[0];
            parent = Array.from(citem.parentNode.children);
            index_item = parent.indexOf(citem);
        }

        switch(true){

            case e.shiftKey && e.keyCode==38:

                if(citem)
                    $("#actions-btns")[0].children[3].click()

                break;

            case e.shiftKey && e.keyCode==40:

                if(citem)
                    $("#actions-btns")[0].children[0].click()

                break; 

            case e.keyCode==38:

                // Moving up a notch from the currently selected item.

                if(index_item==0)
                    return;

                parent[index_item-1].click();

                break;

            case e.keyCode==40:

                // Moving down a notch from the currently selected item.

                if(index_item+1==parent.length)
                    return; 

                parent[index_item+1].click();

                break;

            case e.ctrlKey && e.keyCode==13:

                if(citem)
                    $("#actions-btns")[0].children[1].click()

                break;

            case e.keyCode==13:

                if(citem)
                    $(citem).dblclick();                  
            
                break;

            default:
                // console.log(e.keyCode);
                break;

        }

    });
    

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