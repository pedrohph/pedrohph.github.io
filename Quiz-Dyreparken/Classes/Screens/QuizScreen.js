import { animate } from '../../node_modules/animejs/dist/bundles/anime.esm.min.js';

import Button from "../Button.js";
import Particle from "../Particle.js";
import sfx from '../SoundManager.js';
import TextWrapper from "../TextWrapper.js";

class QuizScreen{

    changeScreenEvent = new CustomEvent('ChangeScreen');

    canvas; context;
    // backgroundImage;

    topBarImage;
    gameMascotImage;
    gameNameLogo;
    
    frameImg;
    mainQuestImg = [,,,,];
    circleImg;
    speechBubble;

    backButton;
    answerButton = [];
    rightAnswerId = 0;

    textWrapper; 

    currentQuest = 0;
    totalClicks = 0;

    particles = [];

    questionMsg = ["Hvilket år ble historien om Klatremus og de andre dyrene i Hakkebakkeskogen utgitt som bok?", "Hvor mange forskjellige dyrearter er det i Dyreparken Kristiansand?", "Sjimpansen Julius ble født andre juledag i Dyreparken Kristiansand, men i hvilket år?", "To av røverne i Kardemommeby heter Jesper og Kasper, men hva heter den tredje?", "Hva er det eneste Kaptein Sabeltann er redd for?"]
    answersMsg = [["1953", "1947", "1962", "1970"], ["Over 100","Ca 85","Ca 70", "Ca 50"], ["1979","1977","1981","1985"],["Jonatan", "Jonny","Jostein","Jarand"], ["Grusomme Gabriel","Andre pirater","Mørket", "Store bølger"]]

    tryAgainMsg = "Feil, men du får en sjanse til🤞🏻"

    randomValue = { value:0};

    changeScreenAnimation = animate(this.randomValue, {
        autoplay: false,
        value: 1,
        duration: 500,
        onComplete: () => {
            this.changeStorage(false)
        }
    });

    startAnimation = () => {
        this.changeScreenAnimation.restart()
    }

    constructor(){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")

        this.textWrapper = new TextWrapper(this.context)
        this.checkButtonEvent();
    }


    reset(){
        //reset all buttons
        this.totalClicks = 0;
        this.answerButton.forEach(button => {
            button.reset();
        });
    }

    draw(){
        if(this.topBarImage != undefined){
            this.context.drawImage(this.topBarImage, this.canvas.width /2 - 680/2, 30, 680, 170)
            this.context.drawImage(this.gameMascotImage, this.canvas.width /2 - 75/2, 92, 75, 100)
            this.context.drawImage(this.gameNameLogo, this.canvas.width /2 - 90, 0, 180, 110)

            this.context.font = "normal 50px Jost"
            this.context.textAlign = "right"

            this.context.fillStyle  = "rgba(255,255,255,1)"

            this.context.fillText(sessionStorage.getItem("TotalQuestionsAnswered")+"/5", this.canvas.width * 0.92, 110)
        }

        if(this.backButton != undefined){
            this.backButton.draw()
        }

        if(this.mainQuestImg[this.currentQuest] != undefined){
            this.context.drawImage(this.mainQuestImg[this.currentQuest], this.canvas.width * 0.5 - 275, this.canvas.height * 0.28, 550, 550)
        }


        // this.context.font = "normal "+this.msgSize+"px TW_Cen"
        this.context.font = "normal 40px Jost"
        this.context.textAlign = "center"

        this.context.fillStyle  = "rgba(0,0,0,1)"
        // this.context.strokeText(this.msg, this.x + this.width * this.butonSize.width/2, yFirstText)
      //  this.context.fillText("Hvilket år ble historien om Klatremus og de andre dyrene i Hakkebakkeskogen utgitt som bok?", this.canvas.width/2, 275)

      this.textWrapper.wrapText(this.questionMsg[this.currentQuest], this.canvas.width/2, 240, 600, 35)

      if(this.totalClicks == 1){
            this.context.font = "normal 65px Jost"
        this.context.textAlign = "center"

        this.context.fillStyle  = "rgba(0,0,0,1)"
        this.context.drawImage(this.speechBubble, this.canvas.width * 0.5 - 575/2, this.canvas.height * 0.4, 575, 460)

        this.textWrapper.wrapText(this.tryAgainMsg, this.canvas.width * 0.5, this.canvas.height * 0.4 + 460 * 0.3, 375, 60)
      }
        // if(this.frameImg != undefined){
        //     this.context.drawImage(this.frameImg, this.canvas.width * 0.5 - 300, this.canvas.height * 0.255, 600, 600)
        // }

        if(this.answerButton.length > 0){
            this.answerButton.forEach(b => {
                b.draw();
            });
        }

        if(this.circleImg != undefined){
            this.context.drawImage(this.circleImg, this.canvas.width * 0.5 - 20, this.canvas.height * 0.805, 40, 40)

        }

        let allDead = true;
        this.particles.forEach(p => {
            if(allDead){
                allDead = p.dead;
            }
            p.draw();
        });

        if(allDead && this.particles.length > 0){
            this.particles = [];
            this.changeStorage(true);
        }

    }

    addButtonsImages(topLeftButtonImg, topRightButtonImg, topLeftCorrect, topLeftIncorrect, topRightCorrect, topRightIncorrect){
        this.answerButton.push(new Button(topLeftButtonImg, this.canvas.width * 0.255, this.canvas.height * 0.775, 330, 110)); //TL
        this.answerButton[0].addCorrectAnswerImage(topLeftCorrect);
        this.answerButton[0].addWrongAnswerImage(topLeftIncorrect);
        
        this.answerButton.push(new Button(topRightButtonImg, this.canvas.width* 0.735, this.canvas.height * 0.775, 330, 110));   //TR
        this.answerButton[1].addCorrectAnswerImage(topRightCorrect);
        this.answerButton[1].addWrongAnswerImage(topRightIncorrect);

        this.answerButton.push(new Button(topRightButtonImg, this.canvas.width * 0.255, this.canvas.height * 0.87, 330, 110));   //BL
        this.answerButton[2].addCorrectAnswerImage(topRightCorrect);
        this.answerButton[2].addWrongAnswerImage(topRightIncorrect);

        this.answerButton.push(new Button(topLeftButtonImg, this.canvas.width * 0.735, this.canvas.height * 0.87, 330, 110));    //BR
        this.answerButton[3].addCorrectAnswerImage(topLeftCorrect);
        this.answerButton[3].addWrongAnswerImage(topLeftIncorrect);

        this.setButtonsOptions(this.answersMsg[this.currentQuest])
    }

    addBackButton(backButtonImg){
        this.backButton = new Button(backButtonImg, this.canvas.width * 0.11, this.canvas.height * 0.075, 150, 150)
        this.backButton.buttonValue = "BackButton"
    }

    checkClickedButton(mousePos){
         if(this.backButton.clickButton(mousePos)){
            // this.changeScreenEvent.newScreen = "MenuScreen";
            // document.dispatchEvent(this.changeScreenEvent);
            this.reset();
        }

        if(this.totalClicks >= 2){
            return;
        }
    
        for(let i = 0; i<this.answerButton.length; i++){
            if(this.answerButton[i].clickButton(mousePos)){
                if(i == this.rightAnswerId){
                    this.answerButton[i].correctButtonAnimation();
                    this.totalClicks = 2;
                    sfx.correctAnswer.play();
                }else{
                    this.answerButton[i].wrongButtonAnimation();
                    this.totalClicks += 1;
                    sfx.incorrectAnswer.play();

                    //this.changeStorage(false)

                }
            }
        }

       
    }

    changeStorage(correct){
        let results = sessionStorage.getItem("QuestionResults");
        let splittedResults = results.split(",");

        let currentQuestionID = parseInt(sessionStorage.getItem("CurrentQuestion"))
        let totalCorrectAnswers = sessionStorage.getItem("TotalQuestionsAnswered")
        let TotalQuestionsAnswered = parseInt(sessionStorage.getItem("TotalQuestionsAnswered"))

        if(correct){
            splittedResults[currentQuestionID] = 1
            sessionStorage.setItem("TotalQuestionsAnswered", totalCorrectAnswers+1)
        }else{
            splittedResults[currentQuestionID] -= 1;
        } 

        if(splittedResults[currentQuestionID] == -2 || splittedResults[currentQuestionID] == 1){
            currentQuestionID += 1;
            TotalQuestionsAnswered += 1;

             sessionStorage.setItem("TotalQuestionsAnswered", TotalQuestionsAnswered);
            sessionStorage.setItem("CurrentQuestion", currentQuestionID)
            sessionStorage.setItem("QuestionResults",splittedResults.toString()); //1 = correct, -1 incorrect but can try again, -2 wrong twice, 0 = not answered

            if(TotalQuestionsAnswered >= 5){
                this.changeScreenEvent.newScreen = "DiplomaScreen";
            }else{
                this.changeScreenEvent.newScreen = "ScanScreen";
            }

            document.dispatchEvent(this.changeScreenEvent);
             this.reset();
        }

        sessionStorage.setItem("QuestionResults",splittedResults.toString()); //1 = correct, -1 incorrect but can try again, -2 wrong twice, 0 = not answered
       
    }

    setButtonsOptions(answers){

        let shuffledAnswers = this.shuffleQuestions(answers);
        console.log(shuffledAnswers)
        for(let i=0; i<4; i++){
            this.answerButton[i].setText("rgba(255,255,255,1)", shuffledAnswers[i], 33);
             this.answerButton[i].setTextMaxWidth(315);
             if(i == this.rightAnswerId){
                this.answerButton[i].buttonValue = "CorrectButton";

             }else{
                this.answerButton[i].buttonValue = "IncorrectButton";

             }
        }
    }

    shuffleQuestions(answers){

        let correctAnswer = answers[0];
        let shuffled = [];
        let originalOne = [answers[0], answers[1], answers[2], answers[3]]
        console.log(originalOne)
        let randomID = 0;
        for(let i=0; i<4;i++){
            randomID = Math.floor(Math.random() * originalOne.length)
                if(originalOne[randomID] == correctAnswer){
                    this.rightAnswerId = i;
                }
            shuffled.push(originalOne[randomID]);
            originalOne.splice(randomID, 1);
        }

        return shuffled;
    }

    checkButtonEvent(){
        document.addEventListener("finishButtonAnimation", (e) =>{
            if(e.buttonValue == "CorrectButton"){
                //this.changeStorage(true)
                sfx.confettiSound.play();
                this.createParticles(this.answerButton[this.rightAnswerId].x, this.answerButton[this.rightAnswerId].y, this.answerButton[this.rightAnswerId].y + this.answerButton[this.rightAnswerId].height);

            }
            if(e.buttonValue == "IncorrectButton"){
                // this.changeStorage(false)
                // this.changeScreenAnimation.play()
                this.changeScreenAnimation.restart()

            }
        })
    }

    createParticles(x1, y1, y2){
        for(let i = 0; i<50; i++){
            this.particles.push(new Particle(x1 + i*7.5, y1, Math.random()*12+15, Math.random() + 1))
            this.particles[this.particles.length-1].setSpeed((Math.random() * 2 - 1) * 15, -30 * Math.random()*10+3)
        }
    
        for(let i = 0; i<50; i++){
            this.particles.push(new Particle(x1 + i*7.5, y2, Math.random()*12+15, Math.random() + 1))
            this.particles[this.particles.length-1].setSpeed((Math.random() * 2 - 1) * 15, -30 * Math.random()*10+3)
        }
    }
}

export default QuizScreen;