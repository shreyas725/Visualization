*************************** Instructions to Run the App **************************

I downloaded the json data and created the web app. So as by javascript security rules, one can't download a json file from the local machine, I recreated and made this a .js file called data.js and stored the information like a variable.
 


There are two different options to run this app -

1. Place your json in /model folder, rename it to data.js and place "jsonData = " to the beginning and ";" to the end (all with no quotes). The app will do the rest

2. Just enter a link to json on top of the window and push the button"


Note :

I also noticed an issue in the json data. The timeline section is based on timestamp field. And I'm pretty sure it's not seconds but milliseconds. Because if it would be a seconds as mentioned, there would be some huge amount of time like 400000 hours etc.