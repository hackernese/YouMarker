
export const ResetBottomActionButtons = (e)=>{

    /*

        There are three buttons at the bottom of this extension
        => Notify / Delete / View

        Calling this function with "e" as the pure HTML element
        which represents the video bar which was clicked on
        it is going to reset the three botom buttons to its
        normal state

    */

    e.classList.remove("vidclicked");
    e.classList.remove("clicked");
    e.classList.add("youtube-videos");
    e.classList.add("vid-hover");
    e.classList.remove("shrink");

    $("#actions-btns").css("display", "none");
    $("#page-num").css("display", "block");
}
export const ResetBottomActionButtonsJQuery = (e)=>{
    
    /*

        Working just like ResetBottomActionButtons(...)
        except the fact that in this case, "e" is not a pure
        HTML element anymore but it's a JQUery object.
    
    */

    ResetBottomActionButtons(e.currentTarget)
}



