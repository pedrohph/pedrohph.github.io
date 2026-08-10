import Particle from "./Classes/Particle.js";
import DiplomaScreen from "./Classes/Screens/DiplomaScreen.js";
import IntroScreen from "./Classes/Screens/IntroScreen.js";
import MainMenu from "./Classes/Screens/MainMenu.js";
import MapScreen from "./Classes/Screens/MapScreen.js";
import QRCodeScreen from "./Classes/Screens/QRCodeScreen.js";
import QuizScreen from "./Classes/Screens/QuizScreen.js";
import sfx from "./Classes/SoundManager.js";

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

let htpButtonImg;
let infoButtonImg;
let backButtonImg;
let basicButtonImg;
let emojiImg;


let frameMainMenuImg;
let frameNailImg;
let frameStringImg;
let gameLogo;
let gameMascot;
let gameNameLogo;
let gameMap;
let starCorrect;
let starIncorrect;

let scanCodeImg;

let currentScreen;
let mainMenu = new MainMenu();
let quizScreen = new QuizScreen();
let mapScreen = new MapScreen();
let qrCodeScreen = new QRCodeScreen();
let diplomaScreen = new DiplomaScreen();
let introScreen = new IntroScreen();

let speechBubble;
setup();
setScreenSize();

function setup(){
    console.log("Quiz - V.: 0.0.9")
    loadMainMenuImages();
    loadBackgroundImages();
    loadButtonImages();
    loadGameHUDImages();
    loadMapIcons();
    
    
    //Temp
    loadQuestionImg();

    refreshStorages();

    createListeners()

    currentScreen = introScreen;
    sfx.music.play();
    update();
}

function setScreenSize(){
    canvas.width=720
    canvas.height= 1280
}

function refreshStorages(){
    //Set all to local storage
     let currentDate = new Date().toJSON().slice(0, 10);
    if(localStorage.getItem("TokenDate") == currentDate){      
        console.log("Same day token")
    }else{
        clearStorate();
    }
}

function clearStorate(){
        let currentDate = new Date().toJSON().slice(0, 10);
        console.log("Clear storage")
        localStorage.clear()

        localStorage.setItem("TokenDate", currentDate)
        localStorage.setItem("QuestionResults","0,0,0,0,0"); //1 = correct, -1 incorrect but can try again, -2 wrong twice, 0 = not answered
        localStorage.setItem("CurrentQuestion",0)
        localStorage.setItem("TotalQuestionsAnswered",0)
}

function loadMainMenuImages(){
    gameLogo = new Image();
    gameLogo.src = "Assets/Arts/new_game_logo.png";
    gameLogo.onload = function(){
        mainMenu.gameLogo = gameLogo;
        introScreen.gameLogo = gameLogo;
        diplomaScreen.gameLogo = gameLogo;

    }

    gameNameLogo = new Image();
    gameNameLogo.src = "Assets/Arts/game_name_logo.png";
    gameNameLogo.onload = function(){
        qrCodeScreen.gameNameLogo = gameNameLogo;
        quizScreen.gameNameLogo = gameNameLogo;
    }


    gameMascot = new Image();
    gameMascot.src = "Assets/Arts/game_mascot.png"
    gameMascot.onload = function(){
        quizScreen.gameMascotImage = gameMascot;
        qrCodeScreen.gameMascotImage = gameMascot;
    }

    frameMainMenuImg = new Image();
    frameMainMenuImg.src = "Assets/Arts/objects/Art_Frame_Body.png"
    frameMainMenuImg.onload = function(){
        mainMenu.frameImg = frameMainMenuImg;
        quizScreen.frameImg = frameMainMenuImg;
        diplomaScreen.frameImg = frameMainMenuImg;
        introScreen.frameImg = frameMainMenuImg;
    }

    frameNailImg = new Image();
    frameNailImg.src = "Assets/Arts/objects/Art_Frame_Nail.png"
    frameNailImg.onload = function(){
        mainMenu.nailImg = frameNailImg;
        diplomaScreen.nailImg = frameNailImg;
        introScreen.nailImg = frameNailImg;
    }

    frameStringImg = new Image();
    frameStringImg.src = "Assets/Arts/objects/Art_Frame_String.png"
    frameStringImg.onload = function(){
        mainMenu.stringImg = frameStringImg;
        diplomaScreen.stringImg = frameStringImg;
        introScreen.stringImg = frameStringImg;
    }

    let quizTextImage = new Image();
    quizTextImage.src = "Assets/Arts/QuizName.png"
    quizTextImage.onload = function(){
        introScreen.quizTextImg = quizTextImage;
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
    
    let qrCodeImg = new Image();
    qrCodeImg.src = "Assets/Arts/qr-code.png";
    qrCodeImg.onload = function(){
        qrCodeScreen.addQRCodeButton(qrCodeImg)
    }

    let scanCodeImg = new Image();
    scanCodeImg.src = "Assets/Arts/skannkoden.png";
    scanCodeImg.onload = function(){
        qrCodeScreen.scanCodeImg= scanCodeImg;
    }
}


function loadMapIcons(){
    gameMap = new Image();
    gameMap.src = "Assets/Arts/map.jpg"
    gameMap.onload = function(){
        mapScreen.mapImg = gameMap;
        qrCodeScreen.addMapButton(gameMap)
    }

    basicButtonImg = new Image();
    basicButtonImg.src = "Assets/Arts/buttons/Button_Menu_Information.png";
    basicButtonImg.onload = function(){
        mapScreen.addBasicButton(basicButtonImg);
    }
}

function loadGameHUDImages(){
    gameTopBarImage = new Image();
    gameTopBarImage.src = "Assets/Arts/objects/Gameplay_Top_Banner.png";
    gameTopBarImage.onload = function(){
        quizScreen.topBarImage = gameTopBarImage;
        qrCodeScreen.topBarImage = gameTopBarImage;
    }

    gameCircle = new Image();
    gameCircle.src = "Assets/Arts/buttons/Button_Middle_Divider.png"
    gameCircle.onload = function(){
        quizScreen.circleImg = gameCircle;
    }

    speechBubble = new Image();
    speechBubble.src = "Assets/Arts/speechBubble.png"
    speechBubble.onload = function(){
        quizScreen.speechBubble = speechBubble;
    }

    starCorrect = new Image();
    starCorrect.src = "Assets/Arts/objects/Gameplay_Star_Full.png";
    starCorrect.onload = function(){
        starIncorrect = new Image();
        starIncorrect.src = "Assets/Arts/objects/Gameplay_Star_Empty.png";
        starIncorrect.onload = function(){
            quizScreen.addStarsImages(starCorrect, starIncorrect);
            qrCodeScreen.addStarsImages(starCorrect, starIncorrect);
        }
    }

    emojiImg = new Image();
    emojiImg.src = "Assets/Arts/crossedFingers.png"
    emojiImg.onload = function(){
        quizScreen.emojiImage = emojiImg;
    }
}

function loadBackgroundImages(){
    portraitBackground = new Image();
    portraitBackground.src = "Assets/Arts/textures/Menu_Background.png";
    portraitBackground.onload = function(){
        mainMenu.backgroundImage = portraitBackground;
        diplomaScreen.backgroundImage = portraitBackground;
        introScreen.backgroundImage = portraitBackground;
    }
}
function loadButtonImages(){
    menuTopButtonImg = new Image();
    menuTopButtonImg.src = "Assets/Arts/buttons/Button_Menu__Main_Top.png";
    menuTopButtonImg.onload = function(){
        
        let startLabelImg = new Image();
        startLabelImg.src = "Assets/Arts/buttons/quistiansand_start.png"
        startLabelImg.onload = function(){
            mainMenu.addTopButton(menuTopButtonImg, startLabelImg)
            // mainMenu.startImg = startLabelImg;
        }
    }

    menuBottomButtonImg = new Image();
    menuBottomButtonImg.src = "Assets/Arts/buttons/Button_Menu_Main_Bottom.png";
    menuBottomButtonImg.onload = function(){
        mainMenu.addBottomButton(menuBottomButtonImg)
    }
       
    let topLeftButtonImg = new Image();
    topLeftButtonImg.src = "Assets/Arts/buttons/Button_Gameplay_Top_Left_Bottom_Right.png";
    topLeftButtonImg.onload = function(){

        let topLeftButtonRight = new Image();
        topLeftButtonRight.src = "Assets/Arts/buttons/Button_Gameplay_Top_Left_Bottom_Right_CORRECT.png";
        topLeftButtonRight.onload = function(){
            let topLeftButtonWrong = new Image();
            topLeftButtonWrong.src = "Assets/Arts/buttons/Button_Gameplay_Top_Left_Bottom_Right_INCORRECT.png";
            topLeftButtonWrong.onload = function(){


                let topRightButtonImg = new Image();
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
        mapScreen.addBackButton(backButtonImg);
        qrCodeScreen.addBackButton(backButtonImg);
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

    if(screen.orientation.type.includes("landscape")){

        mouse.x =  canvas.width - canvas.width * event.y /window.innerHeight
        mouse.y = canvas.height * event.x / window.innerWidth
    }else{
        mouse.x =  canvas.width * event.x / window.innerWidth
        mouse.y = canvas.height * event.y /window.innerHeight
    }



    clickEvent()
})

canvas.addEventListener("touchstart", (event) => {
    let touch = event.targetTouches[0] || event.changedTouches[0];

   
    if(screen.orientation.type.includes("landscape")){

        mouse.x =  canvas.width - canvas.width * touch.pageY /window.innerHeight
        mouse.y = canvas.height * touch.pageX / window.innerWidth
    }else{

        mouse.x =  canvas.width * touch.pageX / window.innerWidth
        mouse.y = canvas.height * touch.pageY /window.innerHeight
    }
   


    clickEvent()
}, false)

function createListeners(){
    document.addEventListener("ChangeScreen", (e) =>{
        if(e.newScreen == "GameScreen"){
            // let currentQuestion = localStorage.getItem("CurrentQuestion")
            let currentQuestion = localStorage.getItem("CurrentQuestion")
            if(currentQuestion < 5){
                // quizScreen.currentQuest = Math.floor(Math.random() * 5);
                quizScreen.currentQuest = currentQuestion;
                quizScreen.setButtonsOptions(quizScreen.answersMsg[currentQuestion])
                currentScreen = quizScreen;
            }else{
                diplomaScreen.checkTotalCorrectAnswers()
                currentScreen = diplomaScreen;
            }
          
        }else  if(e.newScreen == "MenuScreen"){
            currentScreen = mainMenu;
        }else if(e.newScreen == "MapScreen"){
            currentScreen = mapScreen;
        }else if(e.newScreen == "ScanScreen"){
            currentScreen = qrCodeScreen;
        }else if(e.newScreen == "DiplomaScreen"){
            diplomaScreen.checkTotalCorrectAnswers()
            currentScreen = diplomaScreen;
        }else if(e.newScreen == "HTPScreen"){
           clearStorate();
        }

        currentScreen.openScreen();
    })
}

function clickEvent(){
    // if(!sleepDisabled){
    //     noSleep.enable();
    //     sleepDisabled = true;
    // }

    currentScreen.checkClickedButton(mouse)
}