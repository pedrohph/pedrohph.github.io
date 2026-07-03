import Button from "../Button.js";
import TextWrapper from "../TextWrapper.js";

class QuizScreen{

    changeScreenEvent = new CustomEvent('ChangeScreen');

    canvas; context;
    // backgroundImage;

    topBarImage;
    frameImg;
    mainQuestImg = [,,,,];
    circleImg;


    backButton;
    answerButton = [];
    rightAnswerId = 0;

    textWrapper; 

    currentQuest = 0;
    totalClicks = 0;

    questionMsg = ["Hvilket år ble historien om Klatremus og de andre dyrene i Hakkebakkeskogen utgitt som bok?", "Hvor mange forskjellige dyrearter er det i Dyreparken Kristiansand?", "Sjimpansen Julius ble født andre juledag i Dyreparken Kristiansand, men i hvilket år?", "To av røverne i Kardemommeby heter Jesper og Kasper, men hva heter den tredje?", "Hva er det eneste Kaptein Sabeltann er redd for?"]
    answersMsg = [["1947", "1953", "1962", "1970"], ["Ca 85","Ca 70", "Over 100", "Ca 50"], ["1977","1979","1981","1985"],["Jonny","Jostein","Jonatan","Jarand"], ["Andre pirater","Mørket", "Store bølger", "Grusomme Gabriel"]]


    constructor(){
        this.canvas = document.getElementById("main-canvas")
        this.context = this.canvas.getContext("2d")

        this.textWrapper = new TextWrapper(this.context)
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

             // this.context.font = "normal "+this.msgSize+"px TW_Cen"
            this.context.font = "normal 35px Jost"
            this.context.textAlign = "center"

            this.context.fillStyle  = "rgba(255,255,255,1)"

            // this.context.strokeText(this.msg, this.x + this.width * this.butonSize.width/2, yFirstText)
            this.context.fillText("QUIZ", this.canvas.width/2, 155)
        }

        if(this.backButton != undefined){
            this.backButton.draw()
        }

        // this.context.font = "normal "+this.msgSize+"px TW_Cen"
        this.context.font = "normal 40px Jost"
        this.context.textAlign = "center"

        this.context.fillStyle  = "rgba(0,0,0,1)"
        // this.context.strokeText(this.msg, this.x + this.width * this.butonSize.width/2, yFirstText)
      //  this.context.fillText("Hvilket år ble historien om Klatremus og de andre dyrene i Hakkebakkeskogen utgitt som bok?", this.canvas.width/2, 275)

      this.textWrapper.wrapText(this.questionMsg[this.currentQuest], this.canvas.width/2, 240, 600, 35)

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

          if(this.mainQuestImg[this.currentQuest] != undefined){
            this.context.drawImage(this.mainQuestImg[this.currentQuest], this.canvas.width * 0.5 - 275, this.canvas.height * 0.28, 550, 550)
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
    }

    checkClickedButton(mousePos){
         if(this.backButton.clickButton(mousePos)){
            this.changeScreenEvent.newScreen = "MenuScreen";
            document.dispatchEvent(this.changeScreenEvent);
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
                }else{
                    this.answerButton[i].wrongButtonAnimation();
                    this.totalClicks += 1;

                }
            }
        }

       
    }

    setButtonsOptions(answers){

        let shuffledAnswers = this.shuffleQuestions(answers);
        console.log(shuffledAnswers)
        for(let i=0; i<4; i++){
            this.answerButton[i].setText("rgba(255,255,255,1)", shuffledAnswers[i], 33);
             this.answerButton[i].setTextMaxWidth(315);
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
}

export default QuizScreen;