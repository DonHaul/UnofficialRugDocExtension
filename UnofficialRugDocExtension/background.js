//self.importScripts ("jquery-3.6.0.min.js");
var lastProcessingDate = new Date();  



try
{

  //store chains to fetch images later
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnpkV0lpT2pNeExDSnVZVzFsSWpvaVkyaHliMjFsWlhoMFpXNXphVzl1SWl3aVpXMWhhV3dpT2lKaGJIQmhZMkY1YVdWc1pHWmhjbTFsY2l0bGVIUmxibk5wYjI1QVoyMWhhV3d1WTI5dElpd2lhV0YwSWpveE5qSTJOelF5TXpjMExDSmxlSEFpT2pFMk1qWTVOVGd6TnpSOS41VjRsQm5XSWpmMEotTWQzbjZkMVN1RFFXc3ZKMDltYjNFVF9oWlktNkdBOjMx");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  fetch("https://rugdoc.io/wp-json/wp/v2/chain", requestOptions)
    .then(response => response.json()) 
    .then(result => {

      let arr={};



      //fetch only required fields
      result.forEach((x, i) => {     
        arr[x.id]={id:x.id,link:x.link,img:x.network_logo.guid};      
      });

      //store into chrome to use later
      chrome.storage.sync.set({chains: JSON.stringify(arr)});

  }).catch(error => console.log('error', error));




function updateIcon(tabId,colour_rating)
{
/*
7 - green
13 - low risk blue
8 - some risk - neutral
70 - medium risk 
6 - high risk - red
43 - 43 not eligible
*/
console.log(colour_rating);

  switch(colour_rating) {
            
    case 6:
        //sends message back to source with variable
        chrome.action.setIcon({
          path: "images/cropped-favicon-32x32_RED.png",
          tabId: tabId
      });
     break;
     case 70:
      chrome.action.setIcon({
        path: "images/cropped-favicon-32x32_YELLOW.png",
        tabId: tabId
    });
       break;
       case 13:
        chrome.action.setIcon({
          path: "images/cropped-favicon-32x32_BLUE.png",
          tabId: tabId
      });
         break;
         case 8:
          chrome.action.setIcon({
            path: "images/cropped-favicon-32x32_GREY.png",
            tabId: tabId
        });
           break;
       case 7:
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

      //fetch info stored on session storage using the content-script
      chrome.tabs.sendMessage(tabs[0].id, {action: "fetch"}, function(data) {       
    
        
        console.log("received the fetch");
        console.log(data);

        sendResponse(data);

    });

  });
  
  }
});




function   fetchFarmInfo(tabId,tab)
{

  console.log(tab.url);

  

  let urlclean = /(http[s]:\/\/.*?)\//.exec(tab.url)[1];

      //janky
      let farmname  = /http[s]:\/\/(.*)\./.exec(tab.url)[1];
      var res = farmname.split(".");
      farmname = res[res.length-1];

      let farmurl  = /http[s]:\/\/(.*)\//.exec(tab.url)[1];

 
console.log(farmurl);

let splitter = farmurl.split('.')

if(splitter.length>2)
{
  farmurl=splitter[1]+"."+splitter[2];
}
console.log(farmurl);
      
      var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnpkV0lpT2pNeExDSnVZVzFsSWpvaVkyaHliMjFsWlhoMFpXNXphVzl1SWl3aVpXMWhhV3dpT2lKaGJIQmhZMkY1YVdWc1pHWmhjbTFsY2l0bGVIUmxibk5wYjI1QVoyMWhhV3d1WTI5dElpd2lhV0YwSWpveE5qSTJOelF5TXpjMExDSmxlSEFpT2pFMk1qWTVOVGd6TnpSOS41VjRsQm5XSWpmMEotTWQzbjZkMVN1RFFXc3ZKMDltYjNFVF9oWlktNkdBOjMx");
myHeaders.append("Cookie", "PHPSESSID=682f5d525b4848cf92467cdf846d1ea8");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`https://rugdoc.io/wp-json/wp/v2/project/?meta_key=website&meta_value=${farmurl}&meta_compare=LIKE`, requestOptions)
  .then(response => response.json())
  .then(result => {
    
  console.log(result);

  //error or no element exists
  if(res.length===0)
  {
    console.log("This farm does not exits");
    return
  }

    console.log(result);

    
    if (result.length>0)
    {
    updateIcon(tabId,result[0].colour_rating[0]);
  }
  //send to frontend
  //this info will fetched later when the popup is clicked
  chrome.tabs.sendMessage(tabId, {action: "store",payload:result[0],farmurl:farmurl});/*, function(data) { console.log(data); });*/
    
  });
}


chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {


  //only send one request per page load
  //https://stackoverflow.com/questions/59504452/chrome-tabs-onupdated-addlistener-triggers-multiple-times
  if(changeInfo.status !== "complete")
    return;


    //if more than 1 secons has passed since last fetch ignore.
    if (lastProcessingDate.getTime() - (new Date()).getTime()<1000) 

    {
    fetchFarmInfo(tabId,tab);
  }
    lastProcessingDate=new Date();

});

}
catch(e){
console.log(e);
}