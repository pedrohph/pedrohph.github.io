import Timer from "./classes/timer.js";
import sfx from "./classes/soundmanager.js";
import TaskReader from "./classes/taskreader.js";
import particle from "./classes/particles.js";
import movingImage from "./classes/movingImage.js";

const Game_Status = Object.freeze({
  ONBOARDING: '0',
  PLAYING: '1',
  ENDSCREEN: '2',
  INTROVIDEO: '3',
  ENDVIDEO: '4',
  BEFORESTART: '5',
  TIMEBEFOREEND: '6'
});

const introVideo = document.getElementById('Intro-Video');
const endVideo = document.getElementById('End-Video');
const countdownVideo = document.getElementById('Countdown-Video');

let removed_device_list = []
let device_list = []
let bpm_values = []

let higherBPM = -1;
let lowerBPM = 256;
let averageBPM = -1;
let devicesConnected = 0;

let highestBPM = -1;
let lowestBPM = 256;
let gameAverageBPM = []

let timerToCheck = 30;

let underTasksValue = 82;
let overTasksValue = 120;

let current_task = 0;
let current_text_line1 = "FÅ LAGPULS"
let current_text_line2 = "OVER 120"

let bottom_text_line1 = "STRESSNIVÅET ØKER"
let bottom_text_line2 = "UNDER TIDSPRESS"

let totalUsedTime = "00:00"

let typeBarAlpha = 1;

let fullCode = ""
let endAlpha = 1;

let taskReader = new TaskReader();
let tasks = [];

let timer = new Timer();
let lastTime = new Date();
let deltaTime = 0;

const canvas = document.getElementById("main-canvas")
const context = canvas.getContext("2d")

let backgroundAlpha = 0;
let upBackgroundAlpha = true;
let backgroundImage;
let centerImagePulse;
let centerImageEnvelope;
let centerImageTiger;

let boxCenter;
let textBoxTop;
let glowBoxTop;
let fillEffectBoxTop;
let textBoxBottom;
let textBoxLeft;
let textBoxRightTop;
let textBoxRightBottom;
let inputBox;

let glowBoxAlpha = 0;
let growingAlpha = true;
let fillEffectTotal = 0.94;

let specialMessageBottomBar = ""
let specialMessageTimer = 0;
let alphaFeil;

let CurrentStatus = Game_Status.BEFORESTART;

let lionTimer = 0;
let playLionSound = false;

let alarmMessageTime = 0;
let alarmMessageAlpha = 1;
let alarmMessageVisible = true;

let halfHourMessageTime = 0;
let halfHourMessageAlpha = 1;
let halfHourMessageVisible = true;


let recudeTimeAlarmTime = 0;
let reduceTimeAlarmAlpha = 1;
let reduceTimeAlarmVisible = false;

let firstScreenImage
let endTimer = 0;


let adminToolIsOpen = false;
const adminTool = document.getElementById('admin-tool-container');
const confirmButton = document.getElementById('button-confirm-admin-tool');
const cancelButton = document.getElementById('button-cancel-admin-tool');
const underPulseInput = document.getElementById('under-pulse-value');
const overPulseInput = document.getElementById('over-pulse-value');
const newTimeInput = document.getElementById('new-game-time');

const passwordInputs = document.getElementsByClassName('password-input')

let alarm59 = -1;
let alarm56 = -1;
let halfHourAlarm = 1800;

let movingUnImage;
let movingUn;

let endParticles = []
setup();

function setup() {
  sfx.introSound.play()

  console.log("Version 0.0.3")
  // navigator.permissions.query({ name: "Bluetooth" }).then(console.log("Ok")).catch("Error!")
  canvas.width=1280
  canvas.height= 720

  inputBox = document.createElement('input');
  inputBox.onkeydown = handleEnter;
  document.body.appendChild(inputBox);

  loadBoxes()
  update();
  tasks = taskReader.getTasks();

  createEndParticles()
}


function update(){
  requestAnimationFrame(update)
  calculateDeltaTime()

  if(CurrentStatus == Game_Status.BEFORESTART){
    drawFirstImage() 
    return;
  }

  if(removed_device_list.length > 0){
    reconnectDevices();
  }

  if(CurrentStatus == Game_Status.TIMEBEFOREEND){
    endTimer -= deltaTime;
    if(endTimer <= 0){
      setGameStatus(Game_Status.ENDVIDEO)
    }
  }

  if(CurrentStatus == Game_Status.ENDVIDEO){

    if(endVideo.currentTime >= 5 && !sfx.endMusic.playing()){
      console.log("Disparou")
      sfx.aplauseSound.play()
      sfx.endMusic.play();
    }
  }


  if(CurrentStatus == Game_Status.PLAYING){
    if(tasks[current_task].Task_type == 2 && specialMessageTimer <= 0 && !timer.pause){
      inputBox.focus();
    }else{ 
      inputBox.blur();
    }
  }

  timer.update(deltaTime);
  context.clearRect(0, 0, canvas.width, canvas.height);

  //Alarms
  if(alarm59 >= timer.time_left){
    alarm59 -= 600;
    sfx.alarm5930.play();
  }
  
  if(alarm56 >= timer.time_left){
    alarm56 -= 600;
    sfx.alarm5600.play();
  }

  if(halfHourAlarm >= timer.time_left){
    halfHourAlarm = -50;
    halfHourMessage()
  }
  //End Alarms

  if(lionTimer > 0){
    lionTimer -= deltaTime;
  }

  if(!timer.pause){
    getHigherAndLower()
  }



  drawBackground()
  drawGoalImages()
  drawTimer()
  drawCodeBar()
  drawInputBarText()

  if(CurrentStatus != Game_Status.ENDSCREEN){
    drawPulseValues()
  }

  console.log("Total devices connected: "+devicesConnected)

  checkObjective()  
}

function getHigherAndLower(){
  higherBPM = -1;
  lowerBPM = -1;
  averageBPM = 0;
  devicesConnected = 0;
  bpm_values.forEach(bpm => {
    if(bpm > 0){
      if(lowerBPM == -1){
        lowerBPM = bpm;
      }
      if(higherBPM == -1){
        higherBPM = bpm;
      }

      if(bpm > higherBPM){
        higherBPM = bpm;
      }
      if(bpm < lowerBPM){
        lowerBPM = bpm;
      }

      if(CurrentStatus == Game_Status.PLAYING){
        if(bpm < lowestBPM){
          lowestBPM = bpm;
        }
        if(bpm > highestBPM){
          highestBPM = bpm;
        }
      }
     
      averageBPM += bpm;
      devicesConnected++;
    }
  });

  timerToCheck -= deltaTime;

  if(devicesConnected > 0){
    averageBPM /= devicesConnected;

    if(CurrentStatus == Game_Status.PLAYING){
      if(timerToCheck <= 0){
        gameAverageBPM.push(averageBPM);
        timerToCheck = 30;
      }
    }
  }
}

function checkObjective(){
  if(tasks == [] || tasks == undefined){
    tasks = taskReader.getTasks();
  }

  if(current_task >= tasks.length){
    return;
  }

  
  if(playLionSound && lionTimer <= 0){
      //90 seconds
      playLionSound = true;
      lionTimer = 90;
      sfx.lastTaskSound.play()
  }

  if(tasks[current_task].Task_type == 0){
     if(averageBPM >= overTasksValue && averageBPM > 0){
      completePulseTask()
    }
  }else if(tasks[current_task].Task_type == 1){
    if(averageBPM <= underTasksValue && averageBPM > 0){
      completePulseTask();
    }
  }
}

function loadBoxes(){
  boxCenter = new Image()
  boxCenter.src = "assets/images/UI box center_blank.png"

  textBoxTop = new Image()
  textBoxTop.src = "assets/images/UI textbox top.png"

  glowBoxTop = new Image()
  glowBoxTop.src = "assets/images/UI_textbox_top_animation_full_box_glow.png"

  fillEffectBoxTop = new Image()
  fillEffectBoxTop.src = "assets/images/UI_textbox_top_animation_moving_bar.png"

  textBoxBottom = new Image()
  textBoxBottom.src = "assets/images/UI textbox bottom.png"

  textBoxLeft = new Image()
  textBoxLeft.src = "assets/images/UI box left.png"

  textBoxRightTop = new Image()
  textBoxRightTop.src = "assets/images/UI box top right.png"

  textBoxRightBottom = new Image()
  textBoxRightBottom.src = "assets/images/UI box bottom right.png"

  movingUnImage = new Image()
  movingUnImage.src = "assets/images/hacked_centre_logo_UN.png"
  movingUnImage.onload = function(){
   
    movingUn = new movingImage(canvas.width/2, canvas.height/2, 422*0.36, 310*0.36, movingUnImage)

  }
}

function drawBackground(){
    //BG
    if(backgroundImage == undefined){
      backgroundImage = new Image()
      backgroundImage.src = "assets/images/Background.png";

      return;
    }

    context.drawImage(backgroundImage, 0,0, canvas.width, canvas.height);


    if(upBackgroundAlpha){
      backgroundAlpha += deltaTime * 0.2;
      
      if(backgroundAlpha >= 0.27){
        backgroundAlpha = 0.27;
        upBackgroundAlpha = false;
      }
    }else{
      backgroundAlpha -= deltaTime * 0.22;

      if(backgroundAlpha <= 0){
        backgroundAlpha = 0;
        upBackgroundAlpha = true;
      }
    }

    
    
    context.fillStyle = "rgba(0,0,0,"+backgroundAlpha+")";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawTextBoxes()

}

function drawFirstImage(){
  if(firstScreenImage == undefined){
    firstScreenImage = new Image()
    firstScreenImage.src = "assets/images/hackedMessage.png"

    return;
  }

   context.drawImage(firstScreenImage, 0, 0, canvas.width, canvas.height);
}

function drawGoalImages(){

  if(centerImagePulse == undefined){
    centerImagePulse = new Image()
    centerImagePulse.src = "assets/images/pulse_image.jpeg"

    centerImageEnvelope = new Image()
    centerImageEnvelope.src = "assets/images/task_image.jpeg"

    centerImageTiger = new Image()
    centerImageTiger.src = "assets/images/intro_image.png"
    return;
  }

  if(CurrentStatus == Game_Status.ONBOARDING){

    context.beginPath();
    context.rect(canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385); // Add a rectangle to the current path
    context.fillStyle = "black"
    context.fill(); 
    context.drawImage(centerImageTiger, canvas.width * 0.5 - 975*0.19, canvas.height * 0.5 -  970*0.19 , 940*0.385, 940*0.385);
    //drawOnboardingScreen()

  }else if(CurrentStatus == Game_Status.ENDSCREEN){

     context.beginPath(); 
    context.rect(canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385); // Add a rectangle to the current path
    context.fillStyle = "black"
    context.fill();

    context.drawImage(centerImageTiger, canvas.width * 0.5 - 975*0.19, canvas.height * 0.5 -  970*0.19 , 940*0.385, 940*0.385);
    drawUsedTime();
    drawEndingScreen();
    //Draw Status Screen
  }else if(CurrentStatus == Game_Status.TIMEBEFOREEND || CurrentStatus == Game_Status.ENDVIDEO){
    context.drawImage(centerImageEnvelope,  canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385);
  }else if(tasks[current_task].Task_type < 2){
    context.drawImage(centerImagePulse, canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385);
    drawTextOnCenter()
  }else{
    context.drawImage(centerImageEnvelope,  canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385);
    drawTextOnCenter()
  }
  context.drawImage(boxCenter, canvas.width * 0.5 - 981*0.25, canvas.height * 0.5 -  970*0.25 , 981*0.5, 970*0.5);


  if(CurrentStatus == Game_Status.ENDSCREEN){
    let allDead = true;
    movingUn.draw()

    endParticles.forEach(particle => {
      if(!particle.dead){
        allDead = false;
        particle.draw(deltaTime)
      }
    });
    if(allDead && sfx.endMusic.playing()){
      endParticles.length = 0;
      createEndParticles();
      sfx.confettiSound.play()

    }
  }
}

function drawTextBoxes(){
  if(boxCenter == undefined){
    return;
  }
  context.drawImage(textBoxTop, canvas.width * 0.5 - 1772*0.25, 0 , 1772*0.5, 265*0.5);

  if(glowBoxAlpha >=1){
    growingAlpha = false;
  }

  context.drawImage(textBoxBottom, canvas.width * 0.5 - 1145*0.25, canvas.height - 237*0.5 , 1145*0.5, 237*0.5);
  context.drawImage(textBoxLeft, -50, canvas.height*0.6 - 937*0.25 , 854*0.5, 937*0.5);
  context.drawImage(textBoxRightTop, canvas.width - 935 * 0.5, canvas.height*0.5 - 450*0.5 , 844*0.5, 450*0.5);
  context.drawImage(textBoxRightBottom, canvas.width - 935 * 0.5, canvas.height*0.5, 935*0.5, 464*0.5);

}

function drawFinalPasswordEffect(){
  if(fillEffectTotal > 0.0755){
    fillEffectTotal -= deltaTime * 2.25;
    if(fillEffectTotal <= 0.075){
      fillEffectTotal = 0.075;
    }

  //X do corte, Y do corte, W a partir do corte, H a partir do corte, x, y, w, h. 

    context.drawImage(fillEffectBoxTop, 1772 * fillEffectTotal,0, 1772, 265, canvas.width * 0.5 - 1772*0.212, 0 , 1772*0.5, 265*0.5);

    return;
  }
  
  if(growingAlpha){
    glowBoxAlpha += deltaTime * 1.75;
  }else{
    glowBoxAlpha -= deltaTime * 2.75;
    if(glowBoxAlpha <= 0){
      glowBoxAlpha = 0;
    }
  }
  context.globalAlpha = glowBoxAlpha;
  context.drawImage(glowBoxTop, canvas.width * 0.5 - 1772*0.25, 0 , 1772*0.5, 265*0.5);
  context.globalAlpha = 1
}

function drawPulseValues(){
  context.fillStyle = "rgb(0,255,0)";
  context.textAlign = "center";

  context.font = "normal 40px Alarm_Clock";

  //Average Pulse
  context.fillText("LAGPULS",  canvas.width - 905 * 0.25, canvas.height*0.5 - 450*0.23 )
  context.fillText(Math.round(averageBPM),  canvas.width - 905 * 0.25, canvas.height*0.5 - 450*0.23 + 50)

  //Higher Pulse
  if(higherBPM > 1){
    context.fillText("H: " +higherBPM,  canvas.width - 935 * 0.25, canvas.height*0.62)
  }else{
    context.fillText("H: --", canvas.width - 935 * 0.25, canvas.height*0.62)

  }

  //Lower Pulse
  if(lowerBPM > 1){
    context.fillText("L: " +lowerBPM,  canvas.width - 935 * 0.25, canvas.height*0.62+50)

  }else{
    context.fillText("L: --",  canvas.width - 935 * 0.25, canvas.height*0.62+50)
  }
}

// function drawOnboardingScreen(){
//   context.fillStyle = "white";

//   context.font = "normal 30px Impact";
//   context.fillText("Trykk på mellomromstasten for å starte".toUpperCase(), canvas.width/2, 80, 1500*0.5)

//   context.font = "normal 25px Impact";
//  context.fillText("Klikk for å koble til en enhet".toUpperCase(), canvas.width/2, canvas.height - 50)
// }

function drawEndingScreen(){
  context.fillStyle = "white";

  context.font = "normal 30px Impact";
  context.fillText("GRATULERER DERE FANT KRYPTERINGSKODEN!".toUpperCase(), canvas.width/2, 80, 1500*0.5)

  context.font = "normal 25px Impact";
 context.fillText("HACKED".toUpperCase(), canvas.width/2, canvas.height - 50)

  context.fillStyle = "rgb(0,255,0)";
  context.textAlign = "center";

  context.font = "normal 40px Alarm_Clock";

  //Average Pulse
  context.fillText("SNITT PULS",  canvas.width - 905 * 0.25, canvas.height*0.5 - 450*0.23 )
  context.fillText(Math.round(getGameAveragePulse()),  canvas.width - 905 * 0.25, canvas.height*0.5 - 450*0.23 + 50)

  //Higher Pulse
  context.fillText("H: " +highestBPM,  canvas.width - 935 * 0.25, canvas.height*0.62)
  //Lower Pulse
  context.fillText("L: " +lowestBPM,  canvas.width - 935 * 0.25, canvas.height*0.62+50)

}

function drawCodeBar(){
   if(CurrentStatus==Game_Status.ENDSCREEN){
    return;
  }
  context.font = "normal 24px Sauber";
  context.fillStyle = "white";

  // if(CurrentStatus == Game_Status.TIMEBEFOREEND){
  //   endAlpha -= deltaTime * 1;
  //   if(endAlpha <= 0){
  //     endAlpha = 1;
  //   }
  //   context.fillStyle = "rgba(255,255,255,"+endAlpha+")";
  // }else{
  //   context.fillStyle = "white";
  // }


  typeBarAlpha -= deltaTime;
    context.fillText(fullCode.toUpperCase(), canvas.width/2, 80, 1500*0.5)

   
  if(CurrentStatus == Game_Status.TIMEBEFOREEND){
    drawFinalPasswordEffect();
  }

}

function drawInputBarText(){
  if(CurrentStatus != Game_Status.PLAYING && CurrentStatus != Game_Status.TIMEBEFOREEND){
    return;
  }
  context.fillStyle = "white";
  context.font = "normal 32px Sauber";

  typeBarAlpha -= deltaTime;
  
    if(typeBarAlpha < 0){
      typeBarAlpha = 1;
    }

    if(specialMessageTimer > 0){
      specialMessageTimer -= deltaTime 
      alphaFeil -= deltaTime * 1.25;

      if(alphaFeil <= 0){
        alphaFeil = 1;
      }
      if(specialMessageTimer <= 0){
        specialMessageTimer = 0;

        specialMessageBottomBar = "";
        sfx.incorrectPassword.stop()
      }
    }
    
  
    if(specialMessageBottomBar != ""){
      if(specialMessageBottomBar.toUpperCase() == "RIKTIG"){
        context.fillStyle = "rgb(0,255,0)";
      }else  if(specialMessageBottomBar.toUpperCase() == "FEIL"){
        context.fillStyle = "rgba(255,0,0,"+alphaFeil+")";
      }
      context.fillText(specialMessageBottomBar, canvas.width/2 , canvas.height - 50)
    }else if (inputBox === document.activeElement && inputBox.value == "") {
      context.fillStyle = "grey";
      context.fillText("SKRIV INN ORD ELLER TALL".toUpperCase(), canvas.width/2, canvas.height - 50)

      context.fillStyle = "rgba(100,100,100,"+typeBarAlpha+")";
      context.fillText("|", canvas.width/2 + context.measureText("SKRIV INN ORD ELLER TALL ".toUpperCase()).width/2, canvas.height - 50)
    }else if (inputBox === document.activeElement){
      context.fillStyle = "white";
      context.fillText(inputBox.value.toUpperCase(), canvas.width/2, canvas.height - 50)
      context.fillStyle = "rgba(100,100,100,"+typeBarAlpha+")";
      context.fillText("|", canvas.width/2 + context.measureText(inputBox.value.toUpperCase()).width/2, canvas.height - 50)

    }
}

function drawTimer(){
  if(CurrentStatus==Game_Status.ENDSCREEN){
    return;
  }
  if(reduceTimeAlarmVisible || halfHourMessageVisible){
    context.fillStyle = "rgba(255,0,0, +"+ halfHourMessageAlpha +")"; 

  }else{
    context.fillStyle = "rgb(0,255,0)";
  }
  context.font = "normal 75px Alarm_Clock";
  context.textAlign = "center";

  context.fillText(timer.getTimeOnTimeFormat(),  canvas.width * 0.14, canvas.height*0.57)

  if(alarmMessageVisible){
    alarmMessageTime -= deltaTime;
    alarmMessageAlpha -= deltaTime * 1.25;

    if(alarmMessageAlpha <= 0){
      alarmMessageAlpha = 1;
    }

    if(alarmMessageTime <= 0){
      alarmMessageVisible = false;
      sfx.alarmSound.stop()
    }
  }

  if(alarmMessageVisible){
    context.fillStyle = "rgba(255,0,0,"+alarmMessageAlpha+")";
    context.font = "normal 50px Alarm_Clock";
    context.textAlign = "center";

    context.fillText("HASTER!",  canvas.width * 0.14, canvas.height*0.65)
  }

  if(halfHourMessageVisible){
    halfHourMessageTime -= deltaTime;
    halfHourMessageAlpha -= deltaTime * 1.25;

    if(halfHourMessageAlpha <= 0){
      halfHourMessageAlpha = 1;
    }

    if(halfHourMessageTime <= 0){
      halfHourMessageVisible = false;
      halfHourMessageAlpha = 1;
      sfx.alarmSound.stop()

    }
    
    context.fillStyle = "rgba(255,0,0,"+halfHourMessageAlpha+")";
    context.font = "normal 33px Alarm_Clock";
    context.textAlign = "center";

    context.fillText("30 MIN. IGJEN!",  canvas.width * 0.14, canvas.height*0.65)
    // context.fillText("TIME IGJEN!",  canvas.width * 0.14, canvas.height*0.7)
 
  }

   if(reduceTimeAlarmVisible){
    recudeTimeAlarmTime -= deltaTime;
    reduceTimeAlarmAlpha -= deltaTime * 0.75;

    if(reduceTimeAlarmAlpha <= 0){
      reduceTimeAlarmAlpha = 1;
    }
    if(recudeTimeAlarmTime <= 0){
      reduceTimeAlarmVisible = false;
    }
  }

  if(reduceTimeAlarmVisible){
    context.fillStyle = "rgba(255,0,0,"+reduceTimeAlarmAlpha+")";
    context.font = "normal 25px Alarm_Clock";
    context.textAlign = "center";

    context.fillText("00:30 TIDSSTRAFF",  canvas.width * 0.14, canvas.height*0.42)
    context.fillText("VED FEIL KODE",  canvas.width * 0.14, canvas.height*0.46)
  }
}

function drawUsedTime(){
   context.fillStyle = "rgb(0,255,0)";
  context.font = "normal 75px Alarm_Clock";
  context.textAlign = "center";

  context.fillText(totalUsedTime,  canvas.width * 0.14, canvas.height*0.57)

  context.font = "normal 37px Alarm_Clock";
  context.fillText("DERE BRUKTE",  canvas.width * 0.138, canvas.height*0.57 - 80)
}

function drawTextOnCenter(){
  current_text_line1 = tasks[current_task].Tittle_line_1;
  current_text_line2 = tasks[current_task].Tittle_line_2;

  if(tasks[current_task].Task_type == 0){
    current_text_line2 += overTasksValue
  }else if(tasks[current_task].Task_type == 1){
    current_text_line2 += underTasksValue

  }

  context.strokeStyle = "black";
  context.lineWidth = 3;
  context.fillStyle = "white";
  context.font = "normal 45px Impact";
  context.strokeText(current_text_line1, canvas.width/2, canvas.height/2 - 130)
  context.strokeText(current_text_line2, canvas.width/2, canvas.height/2 - 80)
  context.fillText(current_text_line1, canvas.width/2, canvas.height/2 - 130)
  context.fillText(current_text_line2, canvas.width/2, canvas.height/2 - 80)

  context.font = "normal 30px Impact";
  context.strokeText(bottom_text_line1, canvas.width/2, canvas.height/2 + 140)
  context.strokeText(bottom_text_line2, canvas.width/2, canvas.height/2 + 175)
  context.fillText(bottom_text_line1, canvas.width/2, canvas.height/2 + 140)
  context.fillText(bottom_text_line2, canvas.width/2, canvas.height/2 + 175)
}

canvas.addEventListener('click', (event) => {
  if(CurrentStatus == Game_Status.ONBOARDING){
    GetBluetoothPermission()
  }
})

document.addEventListener('keydown', function(event) {
  //Tornar um padrão mais prático
  if(event.code == 'Space' && CurrentStatus == Game_Status.ONBOARDING){
    setGameStatus(Game_Status.INTROVIDEO)
    // setGameStatus(Game_Status.PLAYING)
  }else  if(event.code == 'Space' && CurrentStatus == Game_Status.BEFORESTART){
    if(adminToolIsOpen){
      return;  
    }
    setGameStatus(Game_Status.ONBOARDING)
    
    if(tasks.length <= 0){
      tasks = taskReader.getTasks();
    }
  }

  if(CurrentStatus == Game_Status.PLAYING){
    if(event.ctrlKey && event.shiftKey && event.key === 'E'){
      if(tasks[current_task].Task_type < 2){
        completePulseTask()
      }
    }

    if(event.ctrlKey && event.shiftKey && event.key === 'L'){
      if(timer.pause){
        timer.continueTimer()
      }else{
        timer.pauseTimer()
      }
    }
  }
  if(CurrentStatus == Game_Status.BEFORESTART){
    if(event.ctrlKey && event.shiftKey && event.key === 'E'){
      openAdminTool();
      // adminTool.classList.add("hidden")
    }
  }
});

function handleEnter(e) {
  if(timer.pause){
    return;
  }
  if(tasks[current_task].Task_type != 2){
    return;
  }

  if(e.keyCode == 13){
    completeQuest(tasks[current_task].Goal.includes(inputBox.value.toUpperCase()));
    inputBox.value = ""
  }
    
}

function completeQuest(rightPassword){
  if(rightPassword){
    if(!isNaN(inputBox.value)){
      fullCode += "#";
    }
    fullCode += inputBox.value.toUpperCase();
    specialMessageBottomBar = "RIKTIG"
    specialMessageTimer = 2;

    sfx.correctPassword.play()

    current_task ++;

    if(current_task >= tasks.length){
      current_text_line1 = ""
      current_text_line2 = ""
      
      totalUsedTime = timer.getFinalTime()
      setGameStatus(Game_Status.TIMEBEFOREEND);
      return;

    }

  if(tasks[current_task].Task_type == 0){
      bottom_text_line1 = "STRESSNIVÅET ØKER"
      bottom_text_line2 = "UNDER TIDSPRESS"
      sfx.quickPulse.play()     

  }else if(tasks[current_task].Task_type == 1){
    bottom_text_line1 = "SENK STRESSNIVÅET"
    bottom_text_line2 = ""
    sfx.slowPulse.play()
  }
    
  }else{
    specialMessageTimer = 3;
    alphaFeil = 1;
    specialMessageBottomBar = "FEIL"

    timer.reduceTime(30);

    sfx.incorrectPassword.play()
  }
}

function completePulseTask(){
    sfx.quickPulse.stop();
    sfx.slowPulse.stop();
      current_task ++;

      bottom_text_line1 = ""
      bottom_text_line2 = ""
      
      if(current_task == tasks.length -1){
        lionTimer = 90;
        playLionSound = true;
      }

      sfx.reachPulseLevel.play()
      sfx.correctPassword.play()
}

function GetBluetoothPermission(){
  //Bluetooth
  let options = {
    filters: [
      { services: ["heart_rate"] }
    ]
  };

  navigator.bluetooth
    .requestDevice(options)
    .then((device) => {
      console.log(`Name: ${device.name}`);
        connectToDevice(device, -1);

        device.addEventListener('gattserverdisconnected', (event) => {
          let removedIndex = device_list.indexOf(event.target);
          console.log("removing device", removedIndex)
            if(removedIndex == -1){
              return;
            }
          removed_device_list.push(device_list[removedIndex]);
          device_list.splice(removedIndex, 1)
          bpm_values.splice(removedIndex, 1)
        });
    })
    .catch((error) => console.error(`Something went wrong. ${error}`));
}

function reconnectDevices(){
  console.log("Trying to reconnect")
  let device;
  for(let i = 0; i<removed_device_list.length; i++){
    device = removed_device_list[i]
    connectToDevice(device, i)
  };

}

function connectToDevice(device, id){
  device.gatt.connect().then((device_gatt) =>{
    device_gatt.getPrimaryService("heart_rate").then((ps)=>{
      ps.getCharacteristic("heart_rate_measurement").then((heart_rate_measurement)=>{
        if(!device_list.includes(device)){
          console.log(heart_rate_measurement);
          device_list.push(device)
          bpm_values.push(0);

          if(id != -1){
            removed_device_list.splice(id,1);
          }

          if (heart_rate_measurement.properties.notify) {
            console.log("Notify")
            heart_rate_measurement.addEventListener(
              "characteristicvaluechanged",
              async (event) => {
                let i = device_list.indexOf(device);
                if(i < device_list.length){
                  bpm_values[i] = event.target.value.getUint8(1)
                }
              },
            );
            heart_rate_measurement.startNotifications()
          }
        }

      })
    })
  })
}

function calculateDeltaTime(){
    const currentTime = new Date();
    deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
}

function setGameStatus(newGameStatus){
  CurrentStatus = newGameStatus

  switch(CurrentStatus){
    case Game_Status.PLAYING:
      timer.startTimer();
      sfx.music.play()
      sfx.quickPulse.play()

      highestBPM = -1;
      lowestBPM = 255;
      averageBPM = [];
      timerToCheck = 1;

      break;
    case Game_Status.ONBOARDING:
      sfx.music.play()
      sfx.introSound.stop()
      break;

    case Game_Status.INTROVIDEO:
      alarm59 = timer.starter_time - 90;
      alarm56 = timer.starter_time - 240;
      halfHourAlarm = 1800;
      sfx.music.stop()
     
      startIntroVideo()
      // setGameStatus(Game_Status.PLAYING)
      // setGameStatus(Game_Status.ENDVIDEO)
      break;
    case Game_Status.ENDVIDEO:
     sfx.music.stop();
      sfx.clockSound.stop()

      playLionSound = false;
      startEndVideo()
      break;
    case Game_Status.ENDSCREEN:
      // sfx.endMusic.play()
      sfx.confettiSound.play()
      sfx.aplauseSound.loop(false)
      break;
    case Game_Status.TIMEBEFOREEND:
      endTimer = 2.5;
      timer.pauseTimer();
      break;
  }
}

function startIntroVideo(){
    introVideo.classList.add("video-focus")
    introVideo.play()
    .then(() => console.log('Playback started'))
    .catch(err => console.error('Playback failed:', err));

   introVideo.addEventListener('ended',finishIntroVideo,false);
  // finishIntroVideo()
}

function finishIntroVideo(event){
 introVideo.classList.remove("video-focus");
  
  countdownVideo.currentTime = 0.6;
  countdownVideo.classList.add("video-focus")
    
    countdownVideo.play()
    .then(() => console.log('Playback started'))
    .catch(err => console.error('Playback failed:', err));

   countdownVideo.addEventListener('ended',finishCountdownVideo,false);
  // setGameStatus(Game_Status.PLAYING)

}

function finishCountdownVideo(event){
  countdownVideo.classList.remove("video-focus");
  setGameStatus(Game_Status.PLAYING)
}

function startEndVideo(){
    endVideo.classList.add("video-focus")
    
    endVideo.play()
    .then(() => console.log('Playback started'))
    .catch(err => console.error('Playback failed:', err));

   endVideo.addEventListener('ended',finishEndVideo,false);
}

function finishEndVideo(event){
  endVideo.classList.remove("video-focus");
  setGameStatus(Game_Status.ENDSCREEN)
}

document.addEventListener("TimeAlert", timeAlertMessage);

function timeAlertMessage(){
  sfx.alarmSound.play();

  alarmMessageTime = 10;
  alarmMessageAlpha = 1;
  alarmMessageVisible = true;
}

document.addEventListener("LessTimeAlert", reduceTimeMessage);

function reduceTimeMessage(){
  recudeTimeAlarmTime = 8;
  reduceTimeAlarmAlpha = 1;
  reduceTimeAlarmVisible = true;
}

//document.addEventListener("HalfHourAlert", halfHourMessage);

function halfHourMessage(){
   sfx.alarmSound.play();

    halfHourMessageTime = 10;
    halfHourMessageAlpha = 1;
    halfHourMessageVisible = true;
}

function getGameAveragePulse(){
  let sum = 0;

  gameAverageBPM.forEach(bpmValue => {
    sum += bpmValue;
  });

  return sum / gameAverageBPM.length;
}


function openAdminTool(){
  if(tasks.length == 0){
    tasks = taskReader.getTasks();
  }
 
  adminTool.classList.remove('hidden')
  adminToolIsOpen = true;

  underPulseInput.value = underTasksValue;
  overPulseInput.value = overTasksValue;

  console.log(passwordInputs[0].id)
  for(let i = 0; i<passwordInputs.length; i++){
    tasks.forEach(t => {
    if("FINN KONVOLUTT " +passwordInputs[i].id == t.Tittle_line_1){
      passwordInputs[i].value = t.Goal;
    }
  })
  }
  
}

confirmButton.addEventListener('click', () =>{
  underTasksValue = underPulseInput.value
  overTasksValue = overPulseInput.value
  timer.setTotalTimer(newTimeInput.value * 60);


   for(let i = 0; i<passwordInputs.length; i++){
    getTaskPasswords(passwordInputs[i].id, passwordInputs[i].value)
   }
  

  console.log("Confirmou!")
  adminTool.classList.add('hidden')
  adminToolIsOpen = false;

})

cancelButton.addEventListener('click', () =>{
  adminTool.classList.add('hidden')
  adminToolIsOpen = false;

})

function getTaskPasswords(taskCode, newPassword){

  let passwords = newPassword.split(',')
  tasks.forEach(t => {
    if(t.Tittle_line_1 == "FINN KONVOLUTT "+ taskCode.toUpperCase()){
      t.Goal = []
      passwords.forEach(np => {
        t.Goal.push(np.toUpperCase().trim())
      });
    }
  });
  
}

function createEndParticles(){
  for(let i = 0; i<75; i++){
    endParticles.push(new particle(canvas.width * 0.5 - 981*0.19, 200+i*4.5, Math.random()*12+10, Math.random() + 0.7, ""))
    // endParticles[endParticles.length-1].setSpeed(-10 * Math.random()*5+5, (Math.random() * 2 - 1) * 15)
    endParticles[endParticles.length-1].setSpeed(-10 * Math.random()*5+5, (Math.random() * -15 - 1) * 15)
  }
  for(let i = 0; i<75; i++){
    endParticles.push(new particle(canvas.width * 0.5 + 981*0.19, 200+i*4.5, Math.random()*12+10, Math.random() + 0.7, ""))
    // endParticles[endParticles.length-1].setSpeed(10 * Math.random()*5+5, (Math.random() * 2 - 1) * 15)
    endParticles[endParticles.length-1].setSpeed(10 * Math.random()*5+5, (Math.random() * -15 - 1) * 15)

  }
   for(let i = 0; i<75; i++){
    endParticles.push(new particle(canvas.width * 0.5 - 981*0.19 +i*4.5, canvas.height * 0.5 - 970*0.2, Math.random()*12+10, Math.random() + 0.7, ""))
    // endParticles[endParticles.length-1].setSpeed((Math.random() * 2 - 1) * 15, -20 * Math.random()*5+5)
    endParticles[endParticles.length-1].setSpeed((Math.random() * 2 - 1) * 15, -50 * Math.random()*5+5)
  }
   for(let i = 0; i<75; i++){
    endParticles.push(new particle(canvas.width * 0.5 - 981*0.19 +i*4.5, canvas.height * 0.5 + 970*0.2, Math.random()*12+10, Math.random() + 0.7, ""))
    // endParticles[endParticles.length-1].setSpeed((Math.random() * 2 - 1) * 15, 20 * Math.random()*5+5)
    endParticles[endParticles.length-1].setSpeed((Math.random() * 2 - 1) * 15, -50 * Math.random()*5+5)
  }
}