

var a, b;

$(".bookmark").bind({

    mouseenter : function(e){

        let t = e.currentTarget;
        let timeline = t.children[0];
        let tasks = t.children[2];

        timeline.classList.add("hide_timeline");
        timeline.classList.remove("show_timeline");

        tasks.style.display = "flex";
        

    },

    mouseleave : function(e){

        let t = e.currentTarget;
        let timeline = t.children[0];
        let tasks = t.children[2];

        timeline.classList.remove("hide_timeline");
        timeline.classList.add("show_timeline");

        tasks.classList.add("unload-tasks");

        setTimeout(()=>{

            tasks.classList.remove("unload-tasks");

            tasks.style.display = "none";

        }, 400);
        
    },

    click : function(e){

    }

});

$(".outer-bookmark").ready(()=>{

    setTimeout(()=>{
        $(".outer-bookmark").removeClass("init-bookmark");
    }, 600);

})


const openlink = ()=>{

    let url = $("#youtube-link")[0].innerHTML;
    window.open(url, "_blank");

}

$("#youtube-link").ready(()=>{

    $("#youtube-link").on("click", openlink);

})

$("#notification").ready(()=>{

    $("#notification img").on("click", openlink);

})


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

        a = t;

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

        a = outerbookmark

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
        // Editting the reminder
    });

})