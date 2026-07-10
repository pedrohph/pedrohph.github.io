import TextWrapper from "./TextWrapper.js";

import { animate } from '../node_modules/animejs/dist/bundles/anime.esm.min.js';

class Button{

    finishButtonEvent = new CustomEvent('finishButtonAnimation');
    
    context;

    img; 
    
    defaultImg;
    correctAnswerImg;
    wrongAnswerImg;

    x = 0; y = 0;
    width = 100; height = 100;
    maxWidth = 100;

    msg = "";
    textColor;
    msgSize = 20; 

    startedPressAnimation = false;
   // finishPressAnimation = false;

    textWrapper;

    clicked = false;

    icon;
    iconWidth;
    iconHeight;

    eventValue;

    //Animations 
    butonSize = { width:1, height:1};
    

    //Grow Card Animation
    pressButonAnimation = animate(this.butonSize, {
        autoplay: false,
        alternate: true,
        loop: 1,
        duration: 75,
        width: 0.8,
        height: 0.8,
    onBegin: () => {this.startedPressAnimation = true;
    },
    onComplete: () => {
        // this.finishPressAnimation = true
         this.finishButtonEvent.buttonValue = this.buttonValue;
        document.dispatchEvent(this.finishButtonEvent);
    }
    });

    pressAnimationPlay = () => {
        this.pressButonAnimation.restart()
    }

    constructor(img, x, y, width, height){
        let canvas = document.getElementById("main-canvas")
        this.context = canvas.getContext("2d")

        this.starterY = y
        this.starterX = x
        this.x = this.starterX
        this.y = this.starterY

        this.starterWidth = width
        this.starterHeight = height
        
        this.width = width
        this.height = height
        this.img = img  
        this.defaultImg = img;    

        this.maxWidth = width;

        this.textWrapper = new TextWrapper(this.context)
    }

    addCorrectAnswerImage(correctImage){
        this.correctAnswerImg = correctImage;
    }

    addWrongAnswerImage(wrongImg){
        this.wrongAnswerImg = wrongImg;
    }

    setText(textColor, msg, msgSize1){
        this.textColor = textColor
        this.msg = msg
        this.setTextSize(msgSize1)
    }

    setTextSize(size1){
        this.msgSize = size1
    }

    setMessage(msg){
        this.msg = msg
    }

    setImage(newImg){
        this.img = newImg
    }

    reset(){
        this.width = this.starterWidth
        this.height = this.starterHeight
        this.x = this.starterX
        this.y = this.starterY
        this.finishPressAnimation = false;
        this.startedPressAnimation = false;
        this.img = this.defaultImg;
        this.clicked = false;
    }

    draw(){
        this.x = this.starterX - (this.width * this.butonSize.width)/2
        this.y = this.starterY - (this.height * this.butonSize.height)/2
        this.context.drawImage(this.img, this.x, this.y, this.width * this.butonSize.width, this.height * this.butonSize.height)
        
        
        if(this.msg != ""){
            let yFirstText = this.y + this.height * this.butonSize.height* 0.5 + this.msgSize * 0.5

            // this.context.strokeStyle  = "black"
            // this.context.lineWidth = 4;
            this.context.font = "normal "+this.msgSize * this.butonSize.height+"px Jost"
            this.context.textAlign = "center"

            this.context.fillStyle  = this.textColor

            if(this.context.measureText(this.msg).width <= this.maxWidth){
                this.context.fillText(this.msg, this.x + this.width * this.butonSize.width/2, yFirstText)

            }else{
                yFirstText -= Math.floor(this.context.measureText(this.msg).width / this.maxWidth) * (this.msgSize*0.7)
                this.textWrapper.wrapText(this.msg, this.x + this.width * this.butonSize.width/2, yFirstText, this.maxWidth, this.msgSize * 0.9)
            }
            // this.context.strokeText(this.msg, this.x + this.width * this.butonSize.width/2, yFirstText)
        }
        if(this.icon != undefined){
            let xPos =  this.x + (this.width * this.butonSize.width * 0.5) - (this.width * this.butonSize.width * this.iconWidth/2);
            let yPos = this.y + (this.height * this.butonSize.height * 0.5) - (this.height * this.butonSize.height * this.iconHeight * 0.5);
            this.context.drawImage(this.icon, xPos, yPos, this.width * this.butonSize.width * this.iconWidth, this.height * this.butonSize.height * this.iconHeight)     
        }
        

    }

    clickButton(mouse){
        if(this.clicked){
            return false;
        }

        if(mouse.x - this.x < this.width && mouse.x - this.x > 0 && mouse.y - this.y < this.height && mouse.y - this.y > 0){
            this.pressAnimationPlay();
            return true;
        }
        return false;
    }

    setPosition(posX, posY){
        this.x = posX;
        this.y = posY;
        this.starterX = posX;
        this.starterY = posY;
    }

    setSize(w, h){
        this.width = w;
        this.height = h;
        this.starterWidth = w;
        this.starterHeight = h;
    }

    setTextMaxWidth(maxWidth){
        this.maxWidth = maxWidth;
    }

    setIcon(iconImg, widthMultiplier, heightMultiplier){
        this.icon = iconImg;
        this.iconWidth = widthMultiplier;
        this.iconHeight = heightMultiplier;
    }

    correctButtonAnimation(){
        //add animation
        this.img = this.correctAnswerImg;
        this.clicked = true;
    }

    wrongButtonAnimation(){
        this.img = this.wrongAnswerImg;
        this.clicked = true;


    }

}

export default Button;