import TextWrapper from "../TextWrapper.js";

class DiplomaScreen{
    
    changeScreenEvent = new CustomEvent('ChangeScreen');

    canvas; context;
    backgroundImage;

    gameLogo;
    frameImg;
    nailImg;
    stringImg;

    totalCorrectAnswers = 0;
    
    backButton;
    textWrapper;
    tittleText = "SUPERBRA"
    finalText = "Håper du har hatt en morsom dag i Dyreparken!"
    constructor(){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")

        this.textWrapper = new TextWrapper(this.context);
    }

    

     draw(){
        this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height)
        
        this.context.drawImage(this.stringImg, this.canvas.width * 0.22, this.canvas.height * -0.025, 390, 390)
        this.context.drawImage(this.frameImg, this.canvas.width * 0.15, this.canvas.height * 0.15, 500, 500)
        this.context.drawImage(this.nailImg, this.canvas.width * 0.35, this.canvas.height * 0.045)
        this.context.drawImage(this.gameLogo, this.canvas.width*0.27, this.canvas.height*0.185, 325, 410)


        //119, 40, 217
        this.context.beginPath(); // Start a new path
         this.context.fillStyle  = "rgba(119,40,217,1)"
        this.context.roundRect(this.canvas.width*0.5 - 450/2, this.canvas.height*0.6, 450, 410, 50); // Add a rectangle to the current path
        this.context.fill(); // Render the path

        this.context.font = "normal 55px Jost"
        this.context.textAlign = "center"

        this.context.fillStyle  = "rgba(255,255,255,1)"
        this.context.fillText(this.tittleText, this.canvas.width * 0.5, this.canvas.height*0.675)

        this.context.font = "normal 35px Jost"
        this.textWrapper.wrapText(this.finalText, this.canvas.width/2, this.canvas.height*0.825, 375, 35)

        this.context.fillStyle  = "rgba(255,202,102,1)"
        this.context.strokeStyle  = "black"
        this.context.lineWidth = 10;

        this.context.font = "normal 70px Jost"
        this.context.strokeText(this.totalCorrectAnswers+"/5 rett!", this.canvas.width * 0.5, this.canvas.height*0.76)
        this.context.fillText(this.totalCorrectAnswers+"/5 rett!", this.canvas.width * 0.5, this.canvas.height*0.76) 
    }

    checkTotalCorrectAnswers(){
        let results = sessionStorage.getItem("QuestionResults");
        let splittedResults = results.split(",");

        splittedResults.forEach(answer => {
            if(answer == 1){
                this.totalCorrectAnswers += 1;
            }
        });

        if(this.totalCorrectAnswers == 5 || this.totalCorrectAnswers == 4 ){
            this.tittleText = "SUPERBRA"
        }else if(this.totalCorrectAnswers == 3){
            this.tittleText = "KJEMPEBRA"
        }else if(this.totalCorrectAnswers == 2){
            this.tittleText = "BRA"
        }else{
            this.tittleText = ""
        }
    }

    checkClickedButton(mousePos){
    }
}

export default DiplomaScreen;