$(document).ready(function(){
    $('#toggleButtonID').click(function(){
        $('#toggleButtonID').hide("slow");
        $('#mainApp').show("slow");
    });
    $('#minimizeButton').click(function(){
        $('#toggleButtonID').show("slow");
        $('#mainApp').hide("slow");
    });


    var callInProgress = false;
    var callAllowed = false;
    var timeInterval;

$('#buttonStartCall').hover(
    function(){
        navigator.mediaDevices.getUserMedia({audio:true})
        .then(function(){
            document.querySelector("#buttonStartCall").style.opacity = '1';
            document.querySelector("#buttonEndCall").style.opacity = '0.6';
            if(!callAllowed)
                getDevices();
        })
        .catch(function(){
            document.querySelector("#buttonStartCall").style.opacity = '0.6';
            document.querySelector(".call__allert__text__content").innerHTML = "This sometimes happens when microphone access has been disabled";
            $('#alertMPdisabled').show(100);
            callAllowed = false;
        });
    },
    function(){
        $('#alertMPdisabled').hide(100);
    }
)

$('#buttonStartCall').click(function(){
    if(callAllowed)
    {
        document.querySelector('#buttonStartCall').style.opacity='0.6';
        document.querySelector('#buttonEndCall').style.opacity='1';
        for(var i = 0; i < 3; i++)
            $('.caller__avatar__circle_'+i).show(500);
        totalSeconds = 0;
        timeInterval = setInterval(timer,1000);//update timer each second   
        callInProgress = true;
    }
});

$('#buttonEndCall').click(function(){
    if(callInProgress) endCall();
});

function endCall(){
    document.querySelector('#buttonStartCall').style.opacity='1';
    document.querySelector('#buttonEndCall').style.opacity='0.6';
    for(var i = 0; i < 3; i++)
        $('.caller__avatar__circle_'+i).hide(500);
    clearInterval(timeInterval);  
    document.querySelector('#time').innerHTML = "00:00";
    callInProgress = false;
}

var deviceArray = [];
function getDevices()
{
    deviceArray = [];
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        devices.forEach(function(device) {
            deviceArray.push(device.kind)
    });
        if(deviceArray.includes("audioinput"))
            callAllowed = true;
        else{
            document.querySelector("#buttonStartCall").style.opacity = '0.6';
            document.querySelector(".call__allert__text__content").innerHTML = "There was no audio input device found";
            $('#alertMPdisabled').show("fast");
            callAllowed = false;
        }
    }); 
}

navigator.mediaDevices.ondevicechange = function(event){
    getDevices();
}

var totalSeconds;
function timer()
{
    totalSeconds++;
    var min = Math.floor(totalSeconds/60);
    var sec = totalSeconds % 60;

    if(min < 10) min = '0'+min;
    if(sec < 10) sec = '0'+sec;
    document.querySelector('#time').innerHTML = min + ":" + sec;

    navigator.mediaDevices.getUserMedia({audio:true}).catch(function(){
        endCall();
        document.querySelector('#buttonStartCall').style.opacity='0.6';
    });
}
});
