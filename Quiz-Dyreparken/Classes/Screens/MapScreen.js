import Button from "../Button.js";

class MapScreen{
    changeScreenEvent = new CustomEvent('ChangeScreen');

    canvas;
    context;

    mapImg;

    backButton;
    localButton = [];

    constructor(){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")
    }

    draw(){
        this.context.save()

        this.context.translate(this.canvas.width, 0);
        this.context.rotate(90 * Math.PI / 180)


        this.context.drawImage(this.mapImg, 0, 0, this.canvas.height, this.canvas.width)

        if(this.backButton != undefined){
            this.backButton.draw();
        }

        this.localButton.forEach(b => {
            b.draw()
        });

        this.context.restore();

      
    }

    addBackButton(backButtonImg){
        this.backButton = new Button(backButtonImg, this.canvas.width * 0.11, this.canvas.height * 0.075, 150, 150)
    }

    addBasicButton(buttonImg){
        this.localButton.push(new Button(buttonImg, this.canvas.height * 0.1, this.canvas.width * 0.6, 150, 150))
        this.localButton.push(new Button(buttonImg, this.canvas.height * 0.2, this.canvas.width * 0.27, 150, 150))
        this.localButton.push(new Button(buttonImg, this.canvas.height * 0.54, this.canvas.width * 0.24, 150, 150))
        this.localButton.push(new Button(buttonImg, this.canvas.height * 0.7, this.canvas.width * 0.05, 150, 150))
        this.localButton.push(new Button(buttonImg, this.canvas.height * 0.77, this.canvas.width * 0.6, 150, 150))

    }

    checkClickedButton(mousePos){
        let mouse = {
            x: mousePos.y,
            y: this.canvas.width - mousePos.x
        }
    
        // if(this.backButton.clickButton(mousePos)){
        if(this.backButton.clickButton(mouse)){
            if(sessionStorage.getItem("TotalQuestionsAnswered") == 0){
                this.changeScreenEvent.newScreen = "MenuScreen";
            }else{
                this.changeScreenEvent.newScreen = "ScanScreen";
            }
            
            document.dispatchEvent(this.changeScreenEvent);
            // this.reset();
        }

        for(let i = 0; i< this.localButton.length; i++){
            if(this.localButton[i].clickButton(mouse)){
                console.log("Clicked -", i)
            }
        }
    }

    openScreen(){}
}

export default MapScreen;