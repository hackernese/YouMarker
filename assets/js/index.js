import {
    extract_all_videos,
    AddVideoContentByPage,
    db,
    AddPageEmptyMessage,
    clear_storage
} from "./chrome-utils.js";

import {
    ResetBottomActionButtonsJQuery
} from "./footer.js";

import {
    nextprevButtonsBindEvent,
    BindClickEventActionBtn,
    keystrokes_capture
} from "./bind-events.js";
var selected_mark;


$("#about").on("click", ()=>{
    window.open("/about.html", "_blank");
})

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

        ResetBottomActionButtonsJQuery(selected_mark);

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

        AddVideoContentByPage(1);

    }
    
});


BindClickEventActionBtn();

keystrokes_capture();

// clear_storage();