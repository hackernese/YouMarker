const query_title = "yt-formatted-string.ytd-video-primary-info-renderer";

var $j = jQuery.noConflict();
var tester;
var youtubebar;
var video_container;
var is_played=true;

const loadIcon = async ()=>{

    if($j("#youbookmark-div")[0])
        return; // the button has already been added

    let butn = document.createElement("div");

    butn.classList.add("ytp-button");
    butn.style.width = "40px";
    butn.innerHTML = `
    <div id="youbookmark-div">
        <img src="${chrome.runtime.getURL('assets/img/bookmark-youtube.png')}" class='img-1-ymark'>
    </div>
    `;    
    
    youtubebar.prepend(butn);

    $j("#youbookmark-div").bind("click", (e)=>{

        if(is_played)
            $j("video")[0].pause();

        popup_menu();
    });

}

const getTime = t =>{
    var date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substr(11,8);
}

const popup_menu = async ()=>{

    

    let utility_box = document.createElement("div");

    utility_box.classList.add("ymark-menu-bookmark");

    utility_box.innerHTML = `
    <div class="dmark-root-div appear-dmark">

        <div class='ymark-div2'>
            
            <div class="d" id="bookmark-save-btn">
                <div class="dmark-task-img">
                    <img src="${chrome.runtime.getURL('assets/img/bookmark-add.png')}" class='task-image-ymark'>
                </div>
                <label id="dmark-task-word">Save</label>
            </div>

            <div class="d" id="bookmark-notify-btn">
                <div class="dmark-task-img">
                    <img src="${chrome.runtime.getURL('assets/img/notification.png')}" class='task-image-ymark'>
                </div>
                <label id="dmark-task-word">Notify</label>
            </div>

        </div>

        <div class='ymark-div3'>
            <label>Close</label>
        </div>

    </div>
    
    `;

    video_container.append(utility_box);

    $j(".ymark-div3").bind("click", (e)=>{

        $j(".dmark-root-div").removeClass("appear-dmark");
        $j(".dmark-root-div").addClass("disappear-dmark");

        $j(".ymark-menu-bookmark").addClass("fadeout_ymark");

        setTimeout(function(){

            if(!is_played)
                $j("video")[0].play();

            video_container.children().last().remove();

        }, 300);

    });

    $j("#bookmark-save-btn").bind("click", (e)=>{

        // When the user decides to save back a bookmark
        
        $j(".ymark-menu-bookmark").children().last()
        
        $j(".ymark-menu-bookmark").children().last()[0].style.display = "none";

        $j(".ymark-menu-bookmark").append(
        `
        <div class="add-mark-div">
            <div>
                <label>${document.querySelectorAll(query_title)[1].innerHTML}</label>
            </div>
            <div> 
                <div id="timeline">
                    <label>${$j(".ytp-time-current").html()} / ${$j(".ytp-time-duration").html()}</label>
                </div>
                <textarea id='reminder-template' placeholder="Reminder..."></textarea>
                <label id="y-save-text">Ctrl - Enter to save.</label>
            </div>
            
            <div class="confirm-tasks-btn">
                <button id="cancel">Back</button>
                <button id="save">Save</button>
            </div>
        </div>
        `
        );

        $j("#reminder-template").ready(()=>{

            

            $j("#reminder-template").bind("focus", (e)=>{

                $j("#timeline label").css("visibility", "visible");
    
            });
    
            $j("#reminder-template").bind("blur", (e)=>{
    
                $j("#timeline label").css("visibility", "hidden");
                
            });

            $j("#reminder-template").focus();

            

        });

        $j(".confirm-tasks-btn").ready(()=>{

            $j(".confirm-tasks-btn #cancel").bind("click", (e)=>{
                $j(".ymark-menu-bookmark").children().last().remove();

                $j(".ymark-menu-bookmark").children().last()[0].style.display = "flex";

            });

            $j(".confirm-tasks-btn #save").bind("click", (e)=>{
                
                chrome.storage.sync.set(
                    {
                        
                    }
                )
                console.log(getTime($j(".video-stream")[0].currentTime));

            });

            $j("#reminder-template").keydown((e)=>{

                if (e.ctrlKey && e.keyCode == 13) {
                    $j(".confirm-tasks-btn #save").click();
                };
    
            });

        });

       

    });

    $j("#bookmark-notify-btn").bind("click", (e)=>{

        // When the user decides to add the video to the notify list
        

    });

}





$j(".html5-video-player").ready(function(){video_container = $j(".html5-video-player");});

$j("video").ready(function(){
    $j("video").on("play", ()=>{
        is_played = true;
    });
    $j("video").on("pause", ()=>{
        is_played = false;
    });
});

const load_fonts = async ()=>{
    $j("head").append(`

    <style>
        @font-face {
            font-family: MainFont;
            src: url(${chrome.runtime.getURL('assets/fonts/Oxygen-Regular.ttf')});
        }
        @font-face {
            font-family: HeaderFont;
            src: url(${chrome.runtime.getURL('assets/fonts/Quicksand_Bold.otf')});
        }
        @font-face {
            font-family: ThirdFont;
            src : ${chrome.runtime.getURL('assets/fonts/Exo-Medium.otf')});
        }
    </style>
    
    `);
}

$j(".ytp-right-controls").ready(function() {

    youtubebar = $j(".ytp-right-controls");
    loadIcon();
    
});

(()=>{

    load_fonts();
    

    chrome.runtime.onMessage.addListener((obj, sender, resp)=>{
 
        const {type, id, url} = obj;

        if(type==="newvid"){
            
            // Loading the extension button into the video bar

            $j(".ytp-right-controls").ready(function() {

                youtubebar = $j(".ytp-right-controls");
                loadIcon();
                
            });

        }

    });

})();


// Note : 
// How to grab Youtube's thumbnail 
// ==> https://img.youtube.com/vi/< id of the video>/mqdefault.jpg