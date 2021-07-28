	
    $( document ).ready(function() {


     
     const monthNames = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"
             ];
     //get active tab
     chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        //let data = fetchFarmInfo(tabs[0].title,tabs[0].url)
  
        //fetch info stored on session storage using the content-script
        chrome.tabs.sendMessage(tabs[0].id, {action: "fetch"}, response => {
      console.log("Response is");
      console.log(response);


          
      if(response===null)
      {
        $(".tab-project-title").text("Loading");

        $(".rugdoc-review").html("<br>" + "<p>Please wait while the information is fetched from the servers</p>");
      }
      /*Remove everything but error message*/
      if(response==undefined || response===null)
      {
        $(".review-update").remove();
        $(".masterchef-btn").remove();
        $(".more-info-btn").remove();

        return
      }

      /* */

      
      /* load advert*/
      $('#main-farm-page-box').load('https://server.rugdoc.io/wp-admin/admin-ajax.php?action=aa-server-select&p=main-farm-page div:first').innerHTML;
      

      $(".rugdoc-review").html("<br>" + response.content.rendered);

      console.log($(".tab-project-title"));

      console.log(response.title.rendered);

      
      $(".tab-project-title").text(response.title.rendered);

      

      

/*
7 - green
13 - low risk blue
8 - some risk - neutral
70 - medium risk 
6 - high risk - red
43 - 43 not eligible
*/            
      //switch stmt for risk
      switch(response.colour_rating[0]) {
            
        case 6:
            $(".rugdoc-rating").html('<span class="neutral">⚠️High Risk⚠️</span>');
         break;
         case 70:
            $(".rugdoc-rating").html('<span class="orange">Medium Risk</span>');
           break;
           case 13:
            $(".rugdoc-rating").html('<span class="blue">Low Risk</span>');
             break;
             case 8:
                $(".rugdoc-rating").html('<span class="neutral">Some Risk</span>');
               break;
           case 7:
            $(".rugdoc-rating").html('<span class="green">Least Risk</span>');
             break;
             case "not eligible":
                $(".rugdoc-rating").html('<span class="grey">Not Eligible</span>');
            }
    
            //networks
            chrome.storage.sync.get(['chains'], function(result) {
                console.log(result);
                chains = JSON.parse(result.chains);
                console.log(JSON.parse(result.chains));

                response.chain.forEach((x,i)=>{
            
                    $(".calendar-network-icon").append(`<div><img src="${chains[x].img}" alt="" class="network-logo"></div>`);
                });
              });


              let d = new Date(response.date);
              

              $(".tab-content .review-date").html(`Posted on ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`)

              if(response.updates!=="")
              {
                d = new Date(response.modified);

                $(".review-update").html(` <div class="update-label">Update</div><p>${response.updates}`)
                $(".review-update .review-date").html(`Updated on ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`)          

              }
              else
              {
                  console.log("DELETE UPDATE");
                  $(".review-update").remove();
              }

              $(".masterchef-btn").attr("href", response.masterchef);
              $(".more-info-btn").attr("href", response.link);

    });
     });
    });