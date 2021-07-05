//self.importScripts ("jquery-3.6.0.min.js");

try
{
function updateIcon(tabId,risk)
{
  console.log("UPDATE ICON",risk);
  switch(risk) {
            
    case "high risk":
        //sends message back to source with variable
        chrome.action.setIcon({
          path: "images/cropped-favicon-32x32_RED.png",
          tabId: tabId
      });
     break;
     case "some risk":
      chrome.action.setIcon({
        path: "images/cropped-favicon-32x32_YELLOW.png",
        tabId: tabId
    });
       break;
       case "low risk":
        chrome.action.setIcon({
          path: "images/cropped-favicon-32x32_GREY.png",
          tabId: tabId
      });
         break;
       case "least risk":
        chrome.action.setIcon({
          path: "images/cropped-favicon-32x32_GREEN.png",
          tabId: tabId
      });
         break;
         case "not eligible":
           default:
          chrome.action.setIcon({
            path: "images/cropped-favicon-32x32.png",
            tabId: tabId
        });
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("RECEIVED MSG");
  if(request.action == "populate_popup")
   {
     //get active tab
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      //let data = fetchFarmInfo(tabs[0].title,tabs[0].url)

      fetchFarmInfo1(tabs[0]);
  });
  
  }
});



function   fetchFarmInfo1(tab)
{
  
  let urlclean = /(http[s]:\/\/.*?)\//.exec(tab.url)[1];

      //janky
      let farmname  = /http[s]:\/\/(.*)\./.exec(tab.url)[1];
      var res = farmname.split(".");
      farmname = res[res.length-1];
//http://web.tecnico.ulisboa.pt/~ist181138/rugdoc/?name=jester&url=awesome
//  console.log(`http://localhost/rugdoc.php?name=${farmname}&url=${urlclean}`);

  console.log(`http://web.tecnico.ulisboa.pt/~ist181138/rugdoc/?name=${farmname}&url=${urlclean}`);

  fetch( `http://web.tecnico.ulisboa.pt/~ist181138/rugdoc/?name=${farmname}&url=${urlclean}`).then( function( res ) {


  if(res.status!==200)
  {
    console.log("ERROR");
    return
  }

  res.json().then(function (data){

    if(data==null || data ==undefined || data=="")
    {
      chrome.runtime.sendMessage({action: "popup",payload:null}); 
    }
    else //success
    {
      console.log("populate popup with intel");
      chrome.runtime.sendMessage({action: "popup",payload:data}); 
      
  }
});
});
}


function   fetchFarmInfo2(tabId,tab)
{
  let urlclean = /(http[s]:\/\/.*?)\//.exec(tab.url)[1];

      //janky
      let farmname  = /http[s]:\/\/(.*)\./.exec(tab.url)[1];
      var res = farmname.split(".");
      farmname = res[res.length-1];

  console.log(`http://web.tecnico.ulisboa.pt/~ist181138/rugdoc/?name=${farmname}&url=${urlclean}`);

  fetch( `http://web.tecnico.ulisboa.pt/~ist181138/rugdoc/?name=${farmname}&url=${urlclean}`).then( function( res ) {


  if(res.status!==200)
  {
    console.log("ERROR");
    return
  }

  res.json().then(function (data){

  
      updateIcon(tabId,data.risk);
    
    //send to frontend
  });
});

}



chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
  console.log(tabId)
  console.log(changeInfo)
  console.log(tab)

  //only send one request per page load
  //https://stackoverflow.com/questions/59504452/chrome-tabs-onupdated-addlistener-triggers-multiple-times
  if(changeInfo.status !== "complete")
    return;

    fetchFarmInfo2(tabId,tab);

});

}
catch(e){
console.log(e);
}