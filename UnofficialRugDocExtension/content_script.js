


//MESSAGE HANGLER
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

        console.log("MESSAGE RECEIVED");
        console.log(message);
        //https://stackoverflow.com/questions/31111721/pass-a-variable-from-content-script-to-popup/31112456

        switch(message.action) {
            
            case "store":
                //sends message back to source with variable                
                // Save data to sessionStorage
                //saves as string
                sessionStorage.setItem('data', JSON.stringify(message.payload));
                sessionStorage.setItem('farmurl', message.farmurl);
                break;
            case "fetch":
                //redacts one single time
                sendResponse(JSON.parse(sessionStorage.getItem('data')));
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);





