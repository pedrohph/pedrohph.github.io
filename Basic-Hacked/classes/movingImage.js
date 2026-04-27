import { animate } from '../node_modules/animejs/dist/bundles/anime.esm.min.js'

class movingImage{
    canvas; context;
    posX; posY;
    width; height; 

    mainImg;

    moveImageData = {x: 0, y: 0, w:5}
    moveAnimation = animate(this.moveImageData, {
        autoplay: false,
        x: 1,
        y: 2,
        w: 1,
        duration: 1000,
         ease: 'inOutBack(1.7)'
    });

    constructor(px, py, w, h, img){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")

        this.posX = px;
        this.posY = py;
        this.width = w;
        this.height = h;

        this.mainImg = img;
    }


    draw(){
        console.log(this.moveImageData.x)
        if(this.moveImageData.x == 0){
            this.moveAnimation.play()
        }
        this.context.drawImage(this.mainImg, -225 + this.posX * this.moveImageData.x, -510 + this.posY * this.moveImageData.y, this.width* this.moveImageData.w, this.height* this.moveImageData.w)
        // this.context.drawImage(this.mainImg, this.posX, this.posY, this.width, this.height)
    }

    moveImage(deltaTime){
        this.posX += deltaTime;
        this.posY += deltaTime;

        
    }

    resizeImage(deltaTime){
        this.width -= deltaTime;
        this.height -= deltaTime;
    }
}

export default movingImage;