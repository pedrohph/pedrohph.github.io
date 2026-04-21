import sfx from "./soundmanager.js";

class Timer{
    starter_time;
    time_left = 3600;
    start_time = false;

    firstAlert = false;
    firstAlertTime = 600;

    secondAlert = false;
    secondAlertTime = 300;

    tenMinutesAlert = 0;

    constructor(){
        this.start_time = false;
        
        this.starter_time = this.time_left;
        this.tenMinutesAlert = this.starter_time;

    }

    update(deltaTime){
        if(!this.start_time){
            return;
        }
        if(this.time_left <= 0){
            return;
        }

        this.time_left -= deltaTime;
       
        if(this.time_left <= this.firstAlertTime && !this.firstAlert){
            this.firstAlert = true;
            document.dispatchEvent(this.alertEvent);
        }
        if (this.time_left <= this.secondAlertTime && !this.secondAlert){
            this.secondAlert = true;
            document.dispatchEvent(this.alertEvent);
        }

        if(this.time_left <= 0){
            this.time_left = 0;
           // sfx.timerOver.play();
        }

        if(this.time_left <= this.tenMinutesAlert){
            sfx.clockSound.play()
            this.tenMinutesAlert -= 600;
            // if(this.tenMinutesAlert < 600){
            //     sfx.clockSound.loop(true)
            //     this.tenMinutesAlert = -2;
            // }
        }
    }
    getTimeOnTimeFormat(){
        return (Math.floor(this.time_left / 60).toString().padStart(2, '0'))+":"+(Math.floor(this.time_left) % 60).toString().padStart(2, '0');
    }

    getTimeLeft(){
        return this.time_left;
    }

    setTotalTimer(newTime){
        this.time_left = newTime;
        this.starter_time = this.time_left
        this.tenMinutesAlert = this.starter_time;
    }

    startTimer(){
        this.start_time = true;
    }
    
    getFinalTime(){
        this.start_time = false;
        let m = this.starter_time - this.time_left;
        let s = this.starter_time - this.time_left;
        return Math.floor((m)/ 60).toString().padStart(2, '0')+":"+(Math.ceil(s) % 60).toString().padStart(2, '0');
    }

    reduceTime(totalSeconds){
        document.dispatchEvent(this.lessTimeEvent);
        this.time_left -= totalSeconds;
        if(this.time_left <= 0){
            this.time_left = 0;
        }
    }

    alertEvent = new Event('TimeAlert', {
        bubbles: true,
        cancelable: true,
        composed: true
    });

    lessTimeEvent = new Event('LessTimeAlert',{
        bubbles: true,
        cancelable: true,
        composed: true
    })
}

export default Timer;