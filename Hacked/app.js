import Timer from "./classes/timer.js";
import sfx from "./classes/soundmanager.js";

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

let device_list = []
let bpm_values = []

let higherBPM = -1;
let lowerBPM = 256;
let averageBPM = -1;
let devicesConnected = 0;

let taks_names = ['B','B','C','C','G','G','A','A','F','F','D','D','E','E',]
let current_state = 0;
let current_password = -1;
let current_text_line1 = "FÅ LAGPULS"
let current_text_line2 = "OVER 120"

let bottom_text_line1 = "STRESSNIVÅET ØKER"
let bottom_text_line2 = "UNDER TIDSPRESS"

let totalUsedTime = "00:00"

let typeBarAlpha = 1;

let passwords = ["Sjiraff", "Kardemommeby", "Brumlemann", "11", "Ape", "Krutt", "112111"]
let fullCode = ""

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
let textBoxBottom;
let textBoxLeft;
let textBoxRightTop;
let textBoxRightBottom;
let inputBox;

let specialMessageBottomBar = ""
let specialMessageTimer = 0;
let alphaFeil;

let CurrentStatus = Game_Status.BEFORESTART;

let lionTimer = 0;
let playLionSound = false;

let alarmMessageTime = 0;
let alarmMessageAlpha = 1;
let alarmMessageVisible = true;

let firstScreenImage
let endTimer = 0;

setup();

function setup() {
  sfx.natureSound.play()
  sfx.tigerSound.play()

  console.log("Version 0.0.9")
  navigator.permissions.query({ name: "Bluetooth" }).then(console.log("Ok")).catch("Error!")
  canvas.width=1280
  canvas.height= 720

  inputBox = document.createElement('input');
  inputBox.onkeydown = handleEnter;
  document.body.appendChild(inputBox);

  loadBoxes()
  update();
}


function update(){
  requestAnimationFrame(update)
  calculateDeltaTime()

  if(CurrentStatus == Game_Status.BEFORESTART){
    drawFirstImage() 
    return;
  }

  if(CurrentStatus == Game_Status.TIMEBEFOREEND){
    endTimer -= deltaTime;
    if(endTimer <= 0){
      setGameStatus(Game_Status.ENDVIDEO)
    }
  }

  if(current_state % 2 == 1 && specialMessageTimer <= 0){
    inputBox.focus();
  }else{ 
    inputBox.blur();
  }

  timer.update(deltaTime);
  context.clearRect(0, 0, canvas.width, canvas.height);

  if(lionTimer > 0){
    lionTimer -= deltaTime;
  }

  getHigherAndLower()

  drawBackground()
  drawGoalImages()
  drawTimer()
  drawPulseValues()
  drawCodeBar()
  drawInputBarText()
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
      averageBPM += bpm;
      devicesConnected++;
    }
  });

  if(devicesConnected > 0){
    averageBPM /= devicesConnected;
  }
}

function checkObjective(){
  if(current_state == 14){
    return;
  }
  
  if(playLionSound && lionTimer <= 0){
      //90 seconds
      playLionSound = true;
      lionTimer = 90;
      sfx.lastTaskSound.play()
  }

  if(current_state % 4 == 0){
    if(averageBPM >= 120 && averageBPM > 0){
      completePulseTask()
    }
  }else if(current_state % 4 == 2){
    if(averageBPM <= 87 && averageBPM > 0){
      completePulseTask();
    }
  }
  
}

function loadBoxes(){
  boxCenter = new Image()
  boxCenter.src = "assets/images/UI box center_blank.png"

  textBoxTop = new Image()
  textBoxTop.src = "assets/images/UI textbox top.png"

  textBoxBottom = new Image()
  textBoxBottom.src = "assets/images/UI textbox bottom.png"

  textBoxLeft = new Image()
  textBoxLeft.src = "assets/images/UI box left.png"

  textBoxRightTop = new Image()
  textBoxRightTop.src = "assets/images/UI box top right.png"

  textBoxRightBottom = new Image()
  textBoxRightBottom.src = "assets/images/UI box bottom right.png"
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
    centerImageTiger.src = "assets/images/intro_image.jpeg"
    return;
  }

  if(CurrentStatus == Game_Status.ONBOARDING){
    context.drawImage(centerImageTiger, canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385);
    //drawOnboardingScreen()

  }else if(CurrentStatus == Game_Status.ENDSCREEN){
    context.drawImage(centerImageTiger, canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385);
    drawUsedTime();
    drawEndingScreen();
    //Draw Status Screen
  }else if(CurrentStatus == Game_Status.TIMEBEFOREEND){
    context.drawImage(centerImageEnvelope,  canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385);
  }else if(current_state % 2 == 0){
    context.drawImage(centerImagePulse, canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385);
    drawTextOnCenter()
  }else{
    context.drawImage(centerImageEnvelope,  canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385);
    drawTextOnCenter()
  }
  context.drawImage(boxCenter, canvas.width * 0.5 - 981*0.25, canvas.height * 0.5 -  970*0.25 , 981*0.5, 970*0.5);

}

function drawTextBoxes(){
  if(boxCenter == undefined){
    return;
  }
  context.drawImage(textBoxTop, canvas.width * 0.5 - 1772*0.25, 0 , 1772*0.5, 265*0.5);
  context.drawImage(textBoxBottom, canvas.width * 0.5 - 1145*0.25, canvas.height - 237*0.5 , 1145*0.5, 237*0.5);
  context.drawImage(textBoxLeft, -50, canvas.height*0.6 - 937*0.25 , 854*0.5, 937*0.5);
  context.drawImage(textBoxRightTop, canvas.width - 935 * 0.5, canvas.height*0.5 - 450*0.5 , 844*0.5, 450*0.5);
  context.drawImage(textBoxRightBottom, canvas.width - 935 * 0.5, canvas.height*0.5, 935*0.5, 464*0.5);

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
 context.fillText("DYREPARKEN/HACKED".toUpperCase(), canvas.width/2, canvas.height - 50)
    
}

function drawCodeBar(){
   if(CurrentStatus==Game_Status.ENDSCREEN){
    return;
  }
  context.fillStyle = "white";
  context.font = "normal 24px Sauber";

  typeBarAlpha -= deltaTime;
    context.fillText(fullCode.toUpperCase(), canvas.width/2, 80, 1500*0.5)
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
  context.fillStyle = "rgb(0,255,0)";
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
    setGameStatus(Game_Status.ONBOARDING)
  }

  if(CurrentStatus == Game_Status.PLAYING){
    if(event.ctrlKey && event.shiftKey && event.key === 'E'){
      if(current_state % 2 == 0 && current_state < 13){
        completePulseTask()
      }
    }
  }
});

function handleEnter(e) {
  if(current_state % 2 == 0){
    return;
  }

    if(e.keyCode == 13){
      completeQuest(inputBox.value.toUpperCase() == passwords[current_password].toUpperCase());
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

    if(current_password == 6){
      current_text_line1 = ""
      current_text_line2 = ""
      
      totalUsedTime = timer.getFinalTime()
      setGameStatus(Game_Status.TIMEBEFOREEND);
      return;

    }
    
    if(current_state % 4 == 1){
      current_text_line1 = "FÅ LAGPULS"
      current_text_line2 = "UNDER 87"

      bottom_text_line1 = "SENK STRESSNIVÅET"
      bottom_text_line2 = ""
      sfx.slowPulse.play()

    }else{
      current_text_line1 = "FÅ LAGPULS"
      current_text_line2 = "OVER 120"

      bottom_text_line1 = "STRESSNIVÅET ØKER"
      bottom_text_line2 = "UNDER TIDSPRESS"
      sfx.quickPulse.play()
    }
    
    current_state ++;
  }else{
    specialMessageTimer = 3;
    alphaFeil = 1;
    specialMessageBottomBar = "FEIL"
    sfx.incorrectPassword.play()
  }
}

function completePulseTask(){
    sfx.quickPulse.stop();
    sfx.slowPulse.stop();
      current_state ++;
      current_password ++;
      current_text_line1 = "OPPGAVE "+taks_names[current_state];
      current_text_line2 = ""

      bottom_text_line1 = ""
      bottom_text_line2 = ""
      
      if(current_password == passwords.length -1){
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
    { services: ["heart_rate"] },
    { services: [0x1802, 0x1803] },
    { services: ["c48e6067-5295-48d3-8d5c-0395f61792b1"] },
    { name: "ExampleName" },
    { namePrefix: "Prefix" },
  ],
  optionalServices: ["battery_service"],
};

navigator.bluetooth
  .requestDevice(options)
  .then((device) => {
    console.log(`Name: ${device.name}`);
    device.gatt.connect().then((device_gatt) =>{
      device_gatt.getPrimaryService("heart_rate").then((ps)=>{
        ps.getCharacteristic("heart_rate_measurement").then((heart_rate_measurement)=>{
          console.log(heart_rate_measurement);
          if(!device_list.includes(device.id)){
            device_list.push(device.id)
            bpm_values.push(0);
          }
          if (heart_rate_measurement.properties.notify) {
            console.log("Notify")
            heart_rate_measurement.addEventListener(
              "characteristicvaluechanged",
              async (event) => {
                let i = device_list.indexOf(device.id);
                if(i < device_list.length){
                  bpm_values[i] = event.target.value.getUint8(1)
                }
              },
            );
            heart_rate_measurement.startNotifications()
          }
        })
      })
    });

    //Avaliar melhor depois
    device.addEventListener('gattserverdisconnected', (event) => {
    const disconnectedDevice = event.target;
    console.log(`Device ${disconnectedDevice.name} is disconnected.`);

    });
  })
  .catch((error) => console.error(`Something went wrong. ${error}`));
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
      sfx.quickPulse.play()
      break;
    case Game_Status.INTROVIDEO:
      
      sfx.natureSound.stop()
      sfx.tigerSound.stop()
      startIntroVideo()
      break;
    case Game_Status.ENDVIDEO:
      playLionSound = false;
      startEndVideo()
      break;
    case Game_Status.ENDSCREEN:
      sfx.aplauseSound.play()
      break;
    case Game_Status.TIMEBEFOREEND:
      endTimer = 2;
      break;
  }
}

function startIntroVideo(){
    introVideo.classList.add("video-focus")
    
    introVideo.play()
    .then(() => console.log('Playback started'))
    .catch(err => console.error('Playback failed:', err));

   introVideo.addEventListener('ended',finishIntroVideo,false);
}

function finishIntroVideo(event){
  introVideo.classList.remove("video-focus");
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