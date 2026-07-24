import TextWrapper from "../TextWrapper.js";

class IntroScreen{
    changeScreenEvent = new CustomEvent('ChangeScreen');

    canvas;
    context;
    textWrapper;

    backgroundImage;

    gameLogo;
    frameImg;
    nailImg;
    stringImg;
    quizTextImg;

    introText = "deg rundt i parken"
    finalText = "God tur!"

    currentTime = 4;
    deltaTime = 1;
    lastTime = new Date();

    constructor(){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")

        this.textWrapper = new TextWrapper(this.context);
    }

    draw(){
        this.checkDeltaTime();
        // console.log(this.currentTime)
        if(this.currentTime <= 0){
            this.changeScreenEvent.newScreen = "MenuScreen";
            document.dispatchEvent(this.changeScreenEvent);

            this.currentTime = 300;

        }else{
            this.currentTime -= this.deltaTime;

        }

        if(this.backgroundImage != undefined){
            this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height)
            
            this.context.drawImage(this.stringImg, this.canvas.width * 0.22, this.canvas.height * -0.025, 390, 390)
            this.context.drawImage(this.frameImg, this.canvas.width * 0.15, this.canvas.height * 0.15, 500, 500)
            this.context.drawImage(this.nailImg, this.canvas.width * 0.35, this.canvas.height * 0.045)
            this.context.drawImage(this.gameLogo, this.canvas.width*0.27, this.canvas.height*0.185, 325, 410)
        }


        //119, 40, 217
        this.context.beginPath(); // Start a new path
         this.context.fillStyle  = "rgba(119,40,217,1)"
        this.context.roundRect(this.canvas.width*0.5 - 450/2, this.canvas.height*0.6, 450, 410, 50); // Add a rectangle to the current path
        this.context.fill(); // Render the path

        if(this.quizTextImg != undefined){
            this.context.drawImage(this.quizTextImg, this.canvas.width*0.5 - 250/2, this.canvas.height*0.63, 250, 110)
        }

        this.context.font = "normal 50px Jost"
        this.context.textAlign = "center"

        this.context.fillStyle  = "rgba(255,255,255,1)"
         this.textWrapper.wrapText(this.introText, this.canvas.width * 0.5, this.canvas.height*0.75, 250, 50)

        this.context.font = "normal 45px Jost"
        this.textWrapper.wrapText(this.finalText, this.canvas.width/2, this.canvas.height*0.875, 375, 45)

        // this.context.fillStyle  = "rgba(255,202,102,1)"
        // this.context.strokeStyle  = "black"
        // this.context.lineWidth = 10;

        // this.context.font = "normal 70px Jost"
        // this.context.strokeText(this.totalCorrectAnswers+"/5 rett!", this.canvas.width * 0.5, this.canvas.height*0.76)
        // this.context.fillText(this.totalCorrectAnswers+"/5 rett!", this.canvas.width * 0.5, this.canvas.height*0.76) 

        // this.particles.forEach(p => {
        //     p.draw();
        // });
    }


    checkClickedButton(mousePos){}

    openScreen(){}

    checkDeltaTime(){
        this.deltaTime = 1;
        const currentTime = new Date();
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
    }
}

export default IntroScreen;