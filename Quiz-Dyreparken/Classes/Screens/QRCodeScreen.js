import Button from "../Button.js";
import TextWrapper from "../TextWrapper.js";

class QRCodeScreen{
    changeScreenEvent = new CustomEvent('ChangeScreen');
    canvas; context;

    topBarImage;
    gameMascotImage;
    gameNameLogo;

    qrCodeButton;
    mapButton;
    backButton;

    textWrapper;
    clickOnMapText = "Klikk på kartet for å finne hvor QR-kodene er plassert i parken"
    scanCodeText = "SKANN QR-KODEN"

    stars = [];
    starPositionX = [];
    starPositionY = [];


    scanCodeImg //Temp
    constructor(){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")

        this.textWrapper = new TextWrapper(this.context)
        this.checkButtonEvent();

    }

    draw(){
        this.context.drawImage(this.topBarImage, this.canvas.width /2 - 680/2, 30, 680, 170)
        this.context.drawImage(this.gameMascotImage, this.canvas.width /2 - 75/2, 92, 75, 100)
        this.context.drawImage(this.gameNameLogo, this.canvas.width /2 - 90, 0, 180, 110)

        if(this.scanCodeImg != undefined)
        this.context.drawImage(this.scanCodeImg, this.canvas.width /2 - 260, this.canvas.height * 0.19, 520, 125)


        this.context.font = "normal 50px Jost"
        this.context.textAlign = "right"

        this.context.fillStyle  = "rgba(255,255,255,1)"
        // this.context.fillStyle  = "rgba(0,0,0,1)"

         this.context.fillText(localStorage.getItem("TotalQuestionsAnswered")+"/5", this.canvas.width * 0.92, 110)


        this.backButton.draw();
        this.mapButton.draw();
        this.qrCodeButton.draw();

        //  this.context.font = "normal 60px Jost"
        // this.context.textAlign = "center"

        // this.context.fillStyle  = "rgba(0,0,0,1)"

        // this.textWrapper.wrapText(this.scanCodeText, this.canvas.width/2, this.canvas.height * 0.23, 600, 55); 

        this.context.font = "normal 35px Jost"
        this.context.textAlign = "center"

        this.context.fillStyle  = "rgba(0,0,0,1)"

        this.textWrapper.wrapText(this.clickOnMapText, this.canvas.width/2, this.canvas.height * 0.9, 575, 30);
        
        this.drawStars();
        
    }

    drawStars(){
        for(let i = 0; i<this.stars.length; i++){
            if(this.stars[i] == 1){
                this.context.drawImage(this.startCorrect, this.starPositionX[i], this.starPositionY[i], 50, 50)
            }else{
                this.context.drawImage(this.startIncorrect, this.starPositionX[i], this.starPositionY[i], 50, 50)
            }

        }
    }

    addStarsImages(starCorrect, starIncorrect){
        this.startCorrect = starCorrect; 
        this.startIncorrect = starIncorrect; 
    }

    addQRCodeButton(buttonImg){
        this.qrCodeButton = new Button(buttonImg, this.canvas.width * 0.5, this.canvas.height * 0.45, 450, 450)

    }

    addBackButton(buttonImg){
        this.backButton = new Button(buttonImg, this.canvas.width * 0.11, this.canvas.height * 0.075, 150, 150)
        this.backButton.buttonValue = "BackButton"

    }

    addMapButton(buttonImg){
        this.mapButton = new Button(buttonImg, this.canvas.width * 0.5, this.canvas.height * 0.75, 400, 250)
        this.mapButton.buttonValue = "MapButton"
    }

     checkClickedButton(mousePos){

        if(this.qrCodeButton.clickButton(mousePos)){
            this.changeScreenEvent.newScreen = "GameScreen";
            document.dispatchEvent(this.changeScreenEvent);
        }
        if(this.mapButton.clickButton(mousePos)){
            // this.changeScreenEvent.newScreen = "MapScreen";
            // document.dispatchEvent(this.changeScreenEvent);
        }
        if(this.backButton.clickButton(mousePos)){
           
        }
     }

    checkButtonEvent(){
        document.addEventListener("finishButtonAnimation", (e) =>{
            if(e.buttonValue == "BackButton"){
                this.changeScreenEvent.newScreen = "MenuScreen";
                document.dispatchEvent(this.changeScreenEvent);
            }
            // if(e.buttonValue == "MapButton"){
            //     this.changeScreenEvent.newScreen = "MapScreen";
            //     document.dispatchEvent(this.changeScreenEvent);
            // }
        })
    }

    openScreen(){
        let splittedResults = localStorage.getItem("QuestionResults").split(",");

        this.stars = [];
        this.starPositionX = [this.canvas.width /2 - 50/2, this.canvas.width /2 - 75, this.canvas.width /2 + 25, this.canvas.width /2 - 100, this.canvas.width /2 + 50]
        this.starPositionY = [this.canvas.height * 0.13, this.canvas.height * 0.12, this.canvas.height * 0.12, this.canvas.height * 0.09, this.canvas.height * 0.09]


        for(let i = 0; i<splittedResults.length; i++){
            if(splittedResults[i] == 1){
                this.stars.push(1); //correct star
            }else if(splittedResults[i] == -2){
                this.stars.push(0); //incorrect star
            }
        }
    }
}

export default QRCodeScreen;