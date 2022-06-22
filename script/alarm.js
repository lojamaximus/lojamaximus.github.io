var isAlarmOn = false;

function turnAlarmOnOrOff(){
    if(isAlarmOn){
        document.getElementById("alarmButton").classList.add('off');
        document.getElementById("alarmButton").classList.remove('on');
        isAlarmOn = false;
        return;
    }

    document.getElementById("alarmButton").classList.add('on');
    document.getElementById("alarmButton").classList.remove('off');
    isAlarmOn = true;
}

function playAlarm(){
    document.getElementById("alarm").play();
}
