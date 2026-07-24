import Button from "../Button.js";
import TextWrapper from "../TextWrapper.js";

class MapScreen{
    changeScreenEvent = new CustomEvent('ChangeScreen');

    canvas;
    context;

    mapImg;

    backButton;
    localButton = [];

    // squarePosX = []
    // squarePosY = []
    infoTexts = ["Dere finner QR-koden i Barnas Afrikanske landsby","Dere finner QR-koden ved inngangen til Jungelhuset","Dere finner QR-koden plassert på togstasjonen", "Dere finner QR-koden ved inngangen til Kardemomme by filmstudio","Dere finner QR-koden ved inngangen til Spøkelseshuset"]
    textWrapper;
    currentButtonID = -1;

    constructor(){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")

        this.textWrapper = new TextWrapper(this.context);
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

        this.drawInfoText()

        this.context.restore();

    }

    drawInfoText(){
        if(this.currentButtonID == -1){
            return;
        }
        this.context.beginPath(); // Start a new path
        this.context.fillStyle  = "rgba(119,40,217,1)"
        this.context.roundRect(this.localButton[this.currentButtonID].x - 370 * 0.31, this.localButton[this.currentButtonID].y + 120, 370, 170, 25);
        this.context.fill();

         this.context.font = "normal 30px Jost"
        this.context.textAlign = "center"

        this.context.fillStyle  = "rgba(255,255,255,1)"
        this.textWrapper.wrapText(this.infoTexts[this.currentButtonID], this.localButton[this.currentButtonID].x + 75, this.localButton[this.currentButtonID].y + 160, 350, 35);

    }

    addBackButton(backButtonImg){
        this.backButton = new Button(backButtonImg, this.canvas.width * 0.11, this.canvas.height * 0.075, 150, 150)
    }

    addBasicButton(buttonImg){
        this.localButton.push(new Button(buttonImg, this.canvas.height * 0.14, this.canvas.width * 0.6, 150, 150))
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
            if(localStorage.getItem("TotalQuestionsAnswered") == 0){
                this.changeScreenEvent.newScreen = "MenuScreen";
            }else{
                this.changeScreenEvent.newScreen = "ScanScreen";
            }
            
            document.dispatchEvent(this.changeScreenEvent);
            // this.reset();
            return;
        }

        for(let i = 0; i< this.localButton.length; i++){
            if(this.localButton[i].clickButton(mouse)){
                this.currentButtonID = i;
                return;
            }
        }

        this.currentButtonID = -1;
    }

    openScreen(){
        // this.squarePosX = [this.canvas.height * 0.1, this.canvas.height * 0.2, this.canvas.height * 0.54, this.canvas.height * 0.7, this.canvas.height * 0.77];
        // this.squarePosY = [this.canvas.width * 0.6, this.canvas.width * 0.27, this.canvas.width * 0.24, this.canvas.width * 0.05, this.canvas.width * 0.6]

        this.currentButtonID = -1;
    }
}

export default MapScreen;