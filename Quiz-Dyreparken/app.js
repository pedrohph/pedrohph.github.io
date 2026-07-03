import MainMenu from "./Classes/Screens/MainMenu.js";
import QuizScreen from "./Classes/Screens/QuizScreen.js";
// import TextWrapper from "./Classes/TextWrapper.js";

const canvas = document.getElementById("main-canvas")
const context = canvas.getContext("2d")

const mouse = {
    x: null,
    y: null
}

let portraitBackground;

let gameTopBarImage;
let gameCircle;

let menuTopButtonImg;
let menuBottomButtonImg;
let topLeftButtonImg;
let topRightButtonImg;
let htpButtonImg;
let infoButtonImg;
let backButtonImg;

let frameMainMenuImg;
let frameNailImg;
let frameStringImg;
let gameLogo;
let questionLogo;

let currentScreen;
let mainMenu = new MainMenu();
let quizScreen = new QuizScreen();


setup();
setScreenSize();

function setup(){

    loadMainMenuImages();
    loadBackgroundImages();
    loadButtonImages();
    loadGameHUDImages();
    
    
    //Temp
    loadQuestionImg();

    createListeners()
    // currentScreen = quizScreen;
    currentScreen = mainMenu;
    update();
}

function setScreenSize(){
    canvas.width=720
    canvas.height= 1280

    // let aspectRatio = (screen.width/screen.height)
    // if(screen.orientation.type.includes("landscape")){
    //     if(aspectRatio >= 1.28 && aspectRatio <1.5){
    //         // canvas.width = 1180;
    //         // canvas.height= 820
    //         canvas.width = 1366;
    //         canvas.height= 1024;
    //     }else{
    //         canvas.width=1280
    //         canvas.height= 720
    //     }
    // }else{
    //     if(aspectRatio <= 0.77 && aspectRatio > 0.66){
    //         canvas.width = 1024;
    //         canvas.height= 1366;

    //     }else{
    //         canvas.width=720
    //         canvas.height= 1280
    //     }
        
    // }
}
function loadMainMenuImages(){
    gameLogo = new Image();
    gameLogo.src = "Assets/Arts/game_logo.jpeg";
    gameLogo.onload = function(){
        mainMenu.gameLogo = gameLogo;
    }

    questionLogo = new Image();
    questionLogo.src = "Assets/Arts/question_logo.png";
    questionLogo.onload = function(){
        mainMenu.questionMarkLogo = questionLogo;
    }

    frameMainMenuImg = new Image();
    frameMainMenuImg.src = "Assets/Arts/objects/Art_Frame_Body.png"
    frameMainMenuImg.onload = function(){
        mainMenu.frameImg = frameMainMenuImg;
        quizScreen.frameImg = frameMainMenuImg;
    }

    frameNailImg = new Image();
    frameNailImg.src = "Assets/Arts/objects/Art_Frame_Nail.png"
    frameNailImg.onload = function(){
        mainMenu.nailImg = frameNailImg;
    }

    frameStringImg = new Image();
    frameStringImg.src = "Assets/Arts/objects/Art_Frame_String.png"
    frameStringImg.onload = function(){
        mainMenu.stringImg = frameStringImg;
    }
}

//Temp
function loadQuestionImg(){
    for(let i = 0; i<5; i++){
        let questionImg = new Image();
        questionImg.src = "Assets/Arts/QuizImage/img_"+(i+1)+".png"
        questionImg.onload = function(){
            quizScreen.mainQuestImg[i] = questionImg;
        }
    }
    
}

function loadGameHUDImages(){
    gameTopBarImage = new Image();
    gameTopBarImage.src = "Assets/Arts/objects/Gameplay_Top_Banner.png";
    gameTopBarImage.onload = function(){
        quizScreen.topBarImage = gameTopBarImage;
    }

    gameCircle = new Image();
    gameCircle.src = "Assets/Arts/buttons/Button_Middle_Divider.png"
    gameCircle.onload = function(){
        quizScreen.circleImg = gameCircle;
    }
}

function loadBackgroundImages(){
    portraitBackground = new Image();
    portraitBackground.src = "Assets/Arts/textures/Menu_Background.png";
    portraitBackground.onload = function(){
        mainMenu.backgroundImage = portraitBackground;
        // console.log("Loaded img top")
    }
}
function loadButtonImages(){
    menuTopButtonImg = new Image();
    menuTopButtonImg.src = "Assets/Arts/buttons/Button_Menu__Main_Top.png";
    menuTopButtonImg.onload = function(){
        mainMenu.addTopButton(menuTopButtonImg)
    }

    menuBottomButtonImg = new Image();
    menuBottomButtonImg.src = "Assets/Arts/buttons/Button_Menu_Main_Bottom.png";
    menuBottomButtonImg.onload = function(){
        mainMenu.addBottomButton(menuBottomButtonImg)
    }
       
    topLeftButtonImg = new Image();
    topLeftButtonImg.src = "Assets/Arts/buttons/Button_Gameplay_Top_Left_Bottom_Right.png";
    topLeftButtonImg.onload = function(){

        let topLeftButtonRight = new Image();
        topLeftButtonRight.src = "Assets/Arts/buttons/Button_Gameplay_Top_Left_Bottom_Right_CORRECT.png";
        topLeftButtonRight.onload = function(){
            let topLeftButtonWrong = new Image();
            topLeftButtonWrong.src = "Assets/Arts/buttons/Button_Gameplay_Top_Left_Bottom_Right_INCORRECT.png";
            topLeftButtonWrong.onload = function(){


                topRightButtonImg = new Image();
                topRightButtonImg.src = "Assets/Arts/buttons/Button_Gameplay_Top_Right_Bottom_Left.png";
                topRightButtonImg.onload = function(){
                    let topRightButtonRight = new Image();
                    topRightButtonRight.src = "Assets/Arts/buttons/Button_Gameplay_Top_Right_Bottom_Left_CORRECT.png";
                    topRightButtonRight.onload = function(){
                        let topRightButtonWrong = new Image();
                        topRightButtonWrong.src = "Assets/Arts/buttons/Button_Gameplay_Top_Right_Bottom_Left_INCORRECT.png";
                        topRightButtonWrong.onload = function(){
                            quizScreen.addButtonsImages(topLeftButtonImg, topRightButtonImg, topLeftButtonRight, topLeftButtonWrong, topRightButtonRight, topRightButtonWrong)

                        }
                    }
                }
            }
        }

        
    }

    htpButtonImg = new Image();
    htpButtonImg.src = "Assets/Arts/buttons/Button_Menu_Question_Mark.png"
    htpButtonImg.onload = function(){
        mainMenu.addHTPButton(htpButtonImg)

        // console.log("Loaded HTP button")
    }

    infoButtonImg = new Image();
    infoButtonImg.src = "Assets/Arts/buttons/Button_Menu_Information.png";
    infoButtonImg.onload = function(){
        mainMenu.addInfoButton(infoButtonImg)

    }

    backButtonImg = new Image();
    backButtonImg.src = "Assets/Arts/buttons/Button_Gameplay_Exit_Light.png"
    backButtonImg.onload = function(){
        quizScreen.addBackButton(backButtonImg);
    }
}

function update(){
    requestAnimationFrame(update)
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
} 

function drawBackground(){
    // context.drawImage(portraitBackground, 0, 0, canvas.width, canvas.height)
    currentScreen.draw()
}

canvas.addEventListener('click', (event) => {
    var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    if(supportsTouch){
        return;
    }
    mouse.x =  canvas.width * event.x / window.innerWidth
    mouse.y = canvas.height * event.y /window.innerHeight

    clickEvent()
})

canvas.addEventListener("touchstart", (event) => {
    let touch = event.targetTouches[0] || event.changedTouches[0];    
   
    mouse.x =  canvas.width * touch.pageX / window.innerWidth
    mouse.y = canvas.height * touch.pageY /window.innerHeight


    clickEvent()
}, false)

function createListeners(){
    console.log(mainMenu)
    document.addEventListener("ChangeScreen", (e) =>{
        if(e.newScreen == "GameScreen"){
            quizScreen.currentQuest = Math.floor(Math.random() * 5);
            quizScreen.setButtonsOptions(quizScreen.answersMsg[quizScreen.currentQuest])
            currentScreen = quizScreen;
        }else  if(e.newScreen == "MenuScreen"){
            currentScreen = mainMenu;
        }else{
            console.log("????")
        }
    })
}

function clickEvent(){

    // if(!sleepDisabled){
    //     noSleep.enable();
    //     sleepDisabled = true;
    // }

    currentScreen.checkClickedButton(mouse)
}