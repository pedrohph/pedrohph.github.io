import sfx from "./soundmanager.js";

class Timer{
    starter_time;
    time_left = 3600;
    start_time = false;

    constructor(){
        this.start_time = false;
        
        this.starter_time = this.time_left;
    }

    update(deltaTime){
        if(!this.start_time){
            return;
        }
        if(this.time_left <= 0){
            return;
        }

        this.time_left -= deltaTime;
       
        if(this.time_left <= 0){
            this.time_left = 0;

            sfx.timerOver.play();
        }
    }
    getTimeOnTimeFormat(){
        return (Math.floor(this.time_left / 60).toString().padStart(2, '0'))+":"+(Math.floor(this.time_left) % 60).toString().padStart(2, '0');
    }

    getTimeLeft(){
        return this.time_left;
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

}

export default Timer;