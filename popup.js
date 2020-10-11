// 
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// popup.js (c) 2020
// Desc: Controller
// Created:  Thu Oct 08 2020 18:32:27 GMT+0530 (India Standard Time)
// Modified: Sun Oct 11 2020 13:28:16 GMT+0530 (India Standard Time)
// 

document.addEventListener('DOMContentLoaded', () => {
    
    let x;
    chrome.storage.sync.get(['time', 'enabled'], function (result) {
        if (result.time != undefined)
            document.getElementById('appt').value = result.time;
        if (result.enabled != undefined)
            document.getElementById('power').checked = result.enabled;

        if (document.getElementById('appt').value === '') {
            document.getElementById('power').disabled = true;
            document.getElementById('saveConfig').disabled = true;
            
            document.getElementById("help-text").innerHTML = "Enter time then toggle enable!";
    
            document.getElementById('appt').addEventListener('change', () => {
                document.getElementById('power').disabled = false;
                document.getElementById('saveConfig').disabled = false;
            });
        }
        else {
            document.getElementById('power').disabled = false;
            document.getElementById('saveConfig').disabled = false;
        }
        if (document.getElementById('power').checked) {
            document.getElementById("help-text").innerHTML = "Form will be auto submitted in";
    
            let time = document.getElementById('appt').value.split(':');
            let countDownDate = new Date().setHours(hour = time[0], min = time[1], sec = time[2]);
    
            // Update the count down every 1 second
            x = setInterval(function () {
    
                // Get today's date and time
                let now = new Date().getTime();
    
                // Find the distance between now and the count down date
                let distance = countDownDate - now;
    
                // Time calculations for days, hours, minutes and seconds
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
                if (hours === NaN) hours = 0;
                if (minutes === NaN) minutes = 0;
                if (seconds === NaN) seconds = 0;
    
                // Display the result in the element with id="demo"
                document.getElementById("demo").innerHTML = hours + "h " +
                    minutes + "m " + seconds + "s ";
    
                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("demo").innerHTML = "EXPIRED";
                    document.getElementById("help-text").innerHTML = "Please provide correct time";
                }
            }, 1000);
        }
        else {
            clearInterval(x);
            document.getElementById("demo").innerHTML = "DISABLED";
            document.getElementById("help-text").innerHTML = "Auto submit has been turned off";
        }
    });

    document.getElementById('power').addEventListener('change', submitHandler);
    document.getElementById('saveConfig').addEventListener('click', submitHandler);

    function submitHandler(event) {
        event.preventDefault();
        
        let time = document.getElementById('appt').value;
        chrome.storage.sync.set({ 'enabled': document.getElementById('power').checked, 'time': time }, () => { });

        if (document.getElementById('power').checked) {
            clearInterval(x);
            document.getElementById("help-text").innerHTML = "Form will be auto submitted in";


            time = time.split(':');
            let countDownDate = new Date().setHours(hour = time[0], min = time[1], sec = time[2]);
            x = setInterval(function () {

                // Get today's date and time
                let now = new Date().getTime();

                // Find the distance between now and the count down date
                let distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (hours === NaN) hours = 0;
                if (minutes === NaN) minutes = 0;
                if (seconds === NaN) seconds = 0;

                // Display the result in the element with id="demo"
                document.getElementById("demo").innerHTML = hours + "h " +
                    minutes + "m " + seconds + "s ";

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("demo").innerHTML = "EXPIRED";
                    document.getElementById("help-text").innerHTML = "Please provide correct time";
                }
            }, 1000);
            if (countDownDate - new Date().getTime() > 0)
                chrome.runtime.sendMessage({ time: time, enabled: true });
        }
        else {
            clearInterval(x);
            document.getElementById("demo").innerHTML = "DISABLED";
            document.getElementById("help-text").innerHTML = "Auto submit has been turned off";
            chrome.runtime.sendMessage({ enabled: false });
        }
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.success){
        document.getElementById('power').checked = false;
        chrome.storage.sync.set({ 'enabled': false }, () => { });
    }
});