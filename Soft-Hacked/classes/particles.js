class particle{
    posX;posY;
    growing = true;
    starter_size;
    size;
    life_time;
    currentLife = 0;

    speedY;
    speedX;

    particleAlpha = 1;

    particleImage;
    dead = false;

    imagePath = "assets/images/particles/particles_";
    // gold_fleck_0";


    constructor(posX, posY, size, life_time, particlesPath=""){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")
        
        this.posX = posX;
        this.posY = posY;
        
        this.currentLife = 0;
        this.life_time = life_time;
        this.starter_size = size;
        this.size = size;
        this.particleAlpha = 1;

        this.particleImage = new Image();
        this.particleImage.src = this.imagePath+ particlesPath +"0"+ parseInt(Math.random()*6+1) +".png";

    }

    setSpeed(sx, sy){
        this.speedX = sx;
        this.speedY = sy;
    }

    draw(deltaTime){
        if(this.dead){
            return;
        }
        this.moveParticle(deltaTime)
        this.sizeModifier(deltaTime)

        this.currentLife += deltaTime;
        if(this.life_time <= this.currentLife){
            this.particleAlpha -= deltaTime;
        }
        
        if(this.particleAlpha <= 0){
            this.dead = true;
            this.particleAlpha = 0;
        }

        this.context.globalAlpha = this.particleAlpha;
        this.context.drawImage(this.particleImage, this.posX - this.size/2, this.posY - this.size/2, this.size, this.size)
        this.context.globalAlpha = 1;
    }

    moveParticle(deltaTime){
        this.posX += this.speedX * deltaTime * (Math.random() * 10);
        this.speedY += 1.5;
        this.posY += this.speedY * deltaTime;
    }

    sizeModifier(deltaTime){
        if(this.growing){
            this.size += deltaTime * (Math.random() * 30);
            if(this.size > this.starter_size*1.5){
                this.growing = false;
            }
        }else{
            this.size -= deltaTime * (Math.random() * 30);
            if(this.size < this.starter_size*0.5){
                this.growing = true;
            }
        }
        
    }
}


export default particle;