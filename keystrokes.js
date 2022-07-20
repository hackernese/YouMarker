
var $j = jQuery.noConflict();

const open_main_menu = async (e)=>{

    // Quickly open up the menu without moving the mouse

    $j("#youbookmark-div").click();

}

const open_bookmark_menu = async (e)=>{

    // Quickly bookmark a video without moving the mouse
    // too much

    $j("#youbookmark-div").click();

    $j("#bookmark-save-btn").ready(()=>{
    
        $j("#bookmark-save-btn").click();
    
    });

}


(()=>{


    $j(document).keydown((e)=>{

        if (e.ctrlKey && e.keyCode == 77) {

            // Detecting Ctrl - M which is a shortcut for 
            // opening up the popup menu 

            // Press Ctrl - M again to close it

            if($j(".ymark-menu-bookmark")[0]){
                
                // Checking if the user has previously opened the 
                // menu or not

                $j(".ymark-div3").click(); 
                // If yes then close it

            }else{

                open_main_menu();

            }
            
        };

        if (e.ctrlKey && e.keyCode == 73) {

            // Detecting Ctrl - I which is a shortcut for 
            // opening up the bookmark menu

            // Press Ctrl - I again to close it

            if($j(".ymark-menu-bookmark")[0]){
                
                // Checking if the user has previously opened the 
                // menu or not

                $j(".ymark-div3").click(); 
                // If yes then close it

            }else{

                open_bookmark_menu();

            }


        };

    });


})();