import Button from "../Button.js";

class MainMenu{

    changeScreenEvent = new CustomEvent('ChangeScreen');

    canvas; context;
    backgroundImage;

    gameLogo;
    frameImg;
    nailImg;
    stringImg;

    // startImg;
    playButton;
    mapButton;
    htpButton;
    infoButton;

    constructor(){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")

        this.checkButtonEvent();
    }

    draw(){
        if(this.backgroundImage != null)
            this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height)

        if(this.playButton != undefined){
            this.playButton.draw()
        }
         if(this.mapButton != undefined){
            this.mapButton.draw()
        }
         if(this.htpButton != undefined){
            this.htpButton.draw()
        }
        //  if(this.infoButton != undefined){
        //     this.infoButton.draw()
        // }

        if(this.stringImg != undefined){
            this.context.drawImage(this.stringImg, this.canvas.width * 0.22, this.canvas.height * -0.025, 390, 390)
        }
        if(this.frameImg != undefined){
            this.context.drawImage(this.frameImg, this.canvas.width * 0.15, this.canvas.height * 0.15, 500, 500)
        }
        
        if(this.nailImg != undefined){
            this.context.drawImage(this.nailImg, this.canvas.width * 0.35, this.canvas.height * 0.045)
        }

        if(this.gameLogo != undefined){
            // this.context.drawImage(this.gameLogo, this.canvas.width * 0.29, this.canvas.height * 0.2, 300, 110)
            this.context.drawImage(this.gameLogo, this.canvas.width*0.27, this.canvas.height*0.185, 325, 410)
        }

    }

    addTopButton(buttonImg, startImg){
        
        this.playButton = new Button(buttonImg, this.canvas.width/2, this.canvas.height * 0.65, 425, 111);
        // this.playButton.setText("rgba(255, 255, 255, 1)", "START SPILL", 40)
        this.playButton.setIcon(startImg, 0.5, 0.85)
        this.playButton.buttonValue = "StartButton";
        // this.playButton.setIcon(startImg, 1.75, 1.9)
            // this.context.drawImage(this.startImg, this.playButton.x, this.playButton.y, this.playButton.width * 0.75, this.playButton.height * 0.9)       

    }

    addBottomButton(buttonImg){
        this.mapButton = new Button(buttonImg, this.canvas.width/2, this.canvas.height * 0.75, 425, 111);
        this.mapButton.setText("rgba(255, 255, 255, 1)", "Hvor i parken er spørsmålene?", 40)
        this.mapButton.setTextMaxWidth(425);
        this.mapButton.buttonValue = "MapButton"
        // this.mapButton.setText("rgba(0, 0, 0, 1)", "Hvor i parken er spørsmålene?", 40)

    }

    addHTPButton(buttonImg){
        // this.htpButton = new Button(buttonImg, this.canvas.width * 0.35, this.canvas.height * 0.85, 175, 175);
        this.htpButton = new Button(buttonImg, this.canvas.width * 0.5, this.canvas.height * 0.95, 150, 150);

    }

    addInfoButton(buttonImg){
        this.infoButton = new Button(buttonImg, this.canvas.width * 0.65, this.canvas.height * 0.85, 175, 175);
    }

    checkClickedButton(mousePos){
        
        // if(this.playButton.clickButton(mousePos)){
        //     // this.changeScreenEvent.newScreen = "GameScreen";
        //     // this.changeScreenEvent.newScreen = "ScanScreen";
        //     // document.dispatchEvent(this.changeScreenEvent);
        // }
        
        // if(this.mapButton.clickButton(mousePos)){
        //     // this.changeScreenEvent.newScreen = "MapScreen";
        //     // document.dispatchEvent(this.changeScreenEvent);
        // }

        if(this.htpButton.clickButton(mousePos)){
            this.changeScreenEvent.newScreen = "HTPScreen";
            document.dispatchEvent(this.changeScreenEvent);
        }
        if(this.infoButton.clickButton(mousePos)){
            this.changeScreenEvent.newScreen = "infoScreen";
            document.dispatchEvent(this.changeScreenEvent);
        }

    }

    checkButtonEvent(){
        document.addEventListener("finishButtonAnimation", (e) =>{
            if(e.buttonValue == "StartButton"){
                this.changeScreenEvent.newScreen = "ScanScreen";
                document.dispatchEvent(this.changeScreenEvent);
            }
            if(e.buttonValue == "MapButton"){
                this.changeScreenEvent.newScreen = "MapScreen";
                document.dispatchEvent(this.changeScreenEvent);
            }
        })
    }

    openScreen(){}

}

export default MainMenu;