const query_title = "yt-formatted-string.ytd-video-primary-info-renderer";

var $j = jQuery.noConflict();
var tester;
var youtubebar;
var video_container;
var is_played=true;
const db = "video-list";
// The id inside chrome.storage.sync which will be used multiple times

const loadIcon = async ()=>{

    if($j("#youbookmark-div")[0])
        return; // the button has already been added

    let butn = document.createElement("div");

    butn.classList.add("ytp-button");
    butn.style.width = "40px";
    butn.innerHTML = `
    <div id="youbookmark-div" >
        <img src="${chrome.runtime.getURL('assets/img/bookmark-youtube.png')}" class='img-1-ymark' title="Bookmark this timestamp.">
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

const TimestampExistAlert = (ctimestamp)=>{

    notify("error", `Bookmark for timestamp "${ctimestamp}" has already existed.`);

};


function RemoveMenu(){
    $j(".ymark-menu-bookmark").addClass("fadeout_ymark");

    setTimeout(function(){

        if(!is_played)
            $j("video")[0].play();

        video_container.children().last().remove();

    }, 300);
}

function BookmarkFormBind(vidid, timestamp, ctimestamp){

    // Binding some HTML elements to some events and tweaking some stuffs when a user wish
    // to open the textarea in order to insert notes into the bookmark

    $j(".ymark-menu-bookmark").children().last()
    $j(".ymark-menu-bookmark").children().last()[0].style.display = "none";

    $j(".ymark-menu-bookmark").append(`
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
            <button id="cancel">Close</button>
            <button id="save">Save</button>
        </div>
    </div>
    `);

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
        // Waiting for the note-making form to fully appear on-screen.

        $j(".confirm-tasks-btn #cancel").bind("click", (e)=>{

            // CANCEL BUTTON

            $j(".dmark-root-div").removeClass("appear-dmark");
            $j(".dmark-root-div").addClass("disappear-dmark");

            RemoveMenu();

        });

        $j(".confirm-tasks-btn #save").bind("click", (e)=>{

            // SAVE BUTTON                

            chrome.storage.sync.get([db], (items)=>{

                let {order, videos} = Object.values(items)[0];
                let context = $j("#reminder-template").val();

                if(!videos.hasOwnProperty(vidid)){

                    // video hasn't been added, time to create a new record

                    videos[vidid] = {

                        title : document.querySelectorAll(query_title)[1].innerHTML,
                        // Title of the youtube video
                        fulltime : $j(".video-stream")[0].duration,
                        // The total time of the video
                        url : `https://youtube.com/watch?v=${vidid}`,
                        // The current youtube video URL
                        id : vidid,
                        // The current unique video identifier 
                        img : `https://img.youtube.com/vi/${vidid}/mqdefault.jpg`,
                        // Thumbnail image's link
                        // To grab Youtube's thumbnail : https://img.youtube.com/vi/< id of the video>/mqdefault.jpg
                        bookmarks : {
                            [ctimestamp] : {
                                description : context
                            }
                        },
                        // List of all of the bookmarks which this extension is going to 
                        // add
                        totalmarks : 0,
                        // Total number of bookmarks currently existing

                    };

                    order.unshift(vidid);
                    // Newest video get to stay at the beginning of a list

                }else{

                    // Video id already existed and this might be a brand new 
                    // bookmark

                    if(videos[vidid].bookmarks.hasOwnProperty(ctimestamp)){

                        // Timestamp has already been added

                        TimestampExistAlert(ctimestamp);

                        return;

                    }else{

                        videos[vidid].bookmarks[ctimestamp] = {description:context};

                    }

                }

                chrome.storage.sync.set({[db]:{order:order, videos:videos}}, ()=>{

                    $j(".confirm-tasks-btn #cancel").click();

                    notify("ok", `Created bookmark for timestamp "${ctimestamp}".`);

                    if(!is_played)
                        $j("video")[0].play();


                });

            });

        });

        $j("#reminder-template").keydown((e)=>{

            // Detecting key being made on the reminder-template form.

            if (e.ctrlKey && e.keyCode == 13) {

                // Ctrl + Enter means the user wish to save back information

                $j(".confirm-tasks-btn #save").click();
            };

        });

    });
} 

const popup_menu = async ()=>{

    let utility_box = document.createElement("div");

    utility_box.classList.add("ymark-menu-bookmark");

    utility_box.innerHTML = `<div class="dmark-root-div appear-dmark"></div>`;

    video_container.append(utility_box);

    let url = window.location.href.split("?")[1];
    let urlparser = new URLSearchParams(url);
    let vidid = urlparser.get("v");
    // Splitting the current youtube's id first since it's gonna be used multiple times
    // later in this script...

    let timestamp = parseInt($j(".video-stream")[0].currentTime);
    let ctimestamp = getTime(timestamp);
    // The current timestamp the video has been paused at

    chrome.storage.sync.get([db], (items)=>{

        if(items===undefined)return;

        let {order, videos} = Object.values(items)[0];

        if(videos[vidid]!==undefined){
            if(videos[vidid].bookmarks.hasOwnProperty(ctimestamp)){

                $j(".ymark-menu-bookmark").remove();
                // Removing the entire bookmark section before popping an alert

                TimestampExistAlert(ctimestamp);
                // Popping an alert
                
                return;
                
            }
        }

        BookmarkFormBind(vidid, timestamp, ctimestamp);

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

    // Loadng custom fonts inside the video 

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


function notify(type, msg){

    // This function is used to create a notification box at the bottom of the youtube video
    // This box takes in two parameters which is "type" and "msg"

    /*

        type : Type of message this is
            => "error" : error messages
            => "ok" : Success messages
        msg : the message the user wishes to display.
 
    */

    const img = (
        type=="error" ? 
        chrome.runtime.getURL('assets/img/fail.png') : 
        chrome.runtime.getURL('assets/img/ok.png')
    );

    const html_ = `
    <div class="notify-ymt">

        <div class="${type=='error' ? 'errorbox' : 'successbox'}">
    
            <img src="${img}" />
            <label id="title"></label>
            <p id="message">${msg}</p>
            <div id="loader"></div>
    
        </div>
        
    </div>
    `;

    $j("html").append(html_);

    setTimeout(() => {

        $j(".notify-ymt > div").addClass("loadoff");

        setTimeout(() => {

            $j(".notify-ymt").remove() 

        }, 700);

    }, 7000);

}

(()=>{

    load_fonts();
    // Loadng existing fonts into the system here
    

    chrome.runtime.onMessage.addListener((obj, sender, resp)=>{

        // Recieving message when a new youtube tab is created.
        
        const {type, id} = obj;

        if(type==="NEWVID"){
            
            // Loading the extension button into the video bar

            $j(".ytp-right-controls").ready(function() {

                youtubebar = $j(".ytp-right-controls");
                loadIcon();
                
            });

        }

    });


    chrome.storage.sync.get([db], (e)=>{

        // If this is a freshly initialized extension which just had been installed
        // Initialize it with an empty dataset 

        // Structure : {order:[], videos:[]}

        if(Object.entries(e).length === 0)

            // Initialize the database first 
            chrome.storage.sync.set({[db]:{order:[],videos:{}}});

    });


})();



$j(document).ready(()=>{

    console.log("WTF");
    $j('*').unbind('keyup keydown keypressed');
})