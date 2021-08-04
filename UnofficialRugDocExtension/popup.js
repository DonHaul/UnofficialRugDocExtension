

    chrome.runtime.sendMessage({action: "populate_popup"}, response => {
      console.log("Response is");
      console.log(response);
      
    });
  



console.log("CONTENT SCRIPT");
//Appending HTML by replacing the document.body.innerHTML attribute

let active=false;
let firsttime=true;


//MESSAGE HANGLER
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

        if(firsttime)
        {
            document.body.innerHTML = document.body.innerHTML + '<div id="rug_doc_pop"></div>';
            firsttime=false;
        }

        console.log("INCOMING");
        console.log(message);

       // console.log("MESSAGE RECEIVED");
        //console.log(message);
        //https://stackoverflow.com/questions/31111721/pass-a-variable-from-content-script-to-popup/31112456
        console.log(active);
        console.log("BRA");
        switch(message.action) {
            
            case "popup":
                if(message.payload!=null)
                {

                $("#ruggodocco").html(message.payload.html);

                //adds target black to "More Info button"
                $(".more-info-btn").attr('target','_blank');
                
                //remove visit website button
                $(".project-website-btn").remove();
              }
            break;
     

            default:
                //console.error("Unrecognised message: ", message);
        }
    }
);





