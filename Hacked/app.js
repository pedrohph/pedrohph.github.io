import Timer from "./classes/timer.js";

const Game_Status = Object.freeze({
  ONBOARDING: '0',
  PLAYING: '1',
  ENDSCREEN: '2',
  INTROVIDEO: '3',
  ENDVIDEO: '4'
});

const introVideo = document.getElementById('Intro-Video');

let device_list = []
let bpm_values = []

let higherBPM = -1;
let lowerBPM = 256;
let averageBPM = -1;
let devicesConnected = 0;

let taks_names = ['B','B','C','C','G','G','A','A','F','F','D','D','E','E',]
let current_state = 0;
let current_password = -1;
let current_text_line1 = "FÅ PULSEN"
let current_text_line2 = "OVER 120"

let bottom_text_line1 = "STRESSNIVÅET ØKER"
let bottom_text_line2 = "UNDER TIDSPRESS"

//SENK STRESSNIVÅET

let typeBarAlpha = 1;

let passwords = ["Sjiraff", "Kardemommeby", "Brumlemann", "11", "Ape", "Krutt", "112111"]
let fullCode = ""

let timer = new Timer();
let lastTime = new Date();
let deltaTime = 0;

const canvas = document.getElementById("main-canvas")
const context = canvas.getContext("2d")

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

let CurrentStatus = Game_Status.ONBOARDING;
setup();

function setup() {
  console.log("Version 0.0.5")
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

  if(current_state % 2 == 1 && specialMessageTimer <= 0){
    inputBox.focus();
  }else{ 
    inputBox.blur();
  }

  timer.update(deltaTime);
  context.clearRect(0, 0, canvas.width, canvas.height);


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

  if(current_state % 4 == 0){
    if(averageBPM >= 120 && averageBPM > 0){
      current_state ++;
      current_password ++;
        current_text_line1 = "OPPGAVE "+taks_names[current_state];
        current_text_line2 = ""

        bottom_text_line1 = ""
        bottom_text_line2 = ""
    }
  }else if(current_state % 4 == 2){
    if(averageBPM <= 95 && averageBPM > 0){
      current_state ++;
      current_password ++;

      current_text_line1 = "OPPGAVE "+taks_names[current_state];
      current_text_line2 = ""

      
      bottom_text_line1 = ""
      bottom_text_line2 = ""
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

    drawTextBoxes()

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

  if(CurrentStatus == 0 || CurrentStatus == 2){
    context.drawImage(centerImageTiger, canvas.width * 0.5 - 981*0.19, canvas.height * 0.5 -  970*0.19 , 981*0.385, 970*0.385);
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
  context.fillText("TEAM PULS",  canvas.width - 905 * 0.25, canvas.height*0.5 - 450*0.23 )
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

function drawCodeBar(){
  context.fillStyle = "white";
  context.font = "normal 24px Sauber";

  // if(CurrentStatus == Game_Status.ONBOARDING){
  //   context.font = "normal 30px Impact";
  //   context.fillText("Trykk på mellomromstasten for å starte".toUpperCase(), canvas.width/2, 80, 1500*0.5)
  //   return;
  // }

  typeBarAlpha -= deltaTime;
    context.fillText(fullCode.toUpperCase(), canvas.width/2, 80, 1500*0.5)
}

function drawInputBarText(){
context.fillStyle = "white";
context.font = "normal 35px Sauber";


// if(CurrentStatus == Game_Status.ONBOARDING){
//     context.font = "normal 25px Impact";
//     context.fillText("Klikk for å koble til en enhet".toUpperCase(), canvas.width/2, canvas.height - 50)
//     return;
// }

typeBarAlpha -= deltaTime;
 
  if(typeBarAlpha < 0){
    typeBarAlpha = 1;
  }

  if(specialMessageTimer > 0){
    specialMessageTimer -= deltaTime
    if(specialMessageTimer){
      specialMessageTimer = 0;

      specialMessageBottomBar = "";
    }
  }
  
 
  if(specialMessageBottomBar != ""){
    if(specialMessageBottomBar.toUpperCase() == "RIKTIG"){
      context.fillStyle = "rgb(0,255,0)";
    }else  if(specialMessageBottomBar.toUpperCase() == "FEIL"){
      context.fillStyle = "rgb(255,0,0)";
    }
    context.fillText(specialMessageBottomBar, canvas.width/2 , canvas.height - 50)
  }else if (inputBox === document.activeElement && inputBox.value == "") {
    context.fillStyle = "grey";
    context.fillText("Skriv koden her".toUpperCase(), canvas.width/2, canvas.height - 50)

    context.fillStyle = "rgba(100,100,100,"+typeBarAlpha+")";
    context.fillText("|", canvas.width/2 + context.measureText("Skriv koden her ".toUpperCase()).width/2, canvas.height - 50)
  }else if (inputBox === document.activeElement){
    context.fillStyle = "white";
    context.fillText(inputBox.value.toUpperCase(), canvas.width/2, canvas.height - 50)
    context.fillStyle = "rgba(100,100,100,"+typeBarAlpha+")";
    context.fillText("|", canvas.width/2 + context.measureText(inputBox.value.toUpperCase()).width/2, canvas.height - 50)

  }
}

function drawTimer(){
  context.fillStyle = "rgb(0,255,0)";
  context.font = "normal 75px Alarm_Clock";
  context.textAlign = "center";


  context.fillText(timer.getTimeOnTimeFormat(),  canvas.width * 0.14, canvas.height*0.57)
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

// canvas.addEventListener("touchstart", (event) => {
//   //  console.log("Tocou")
//   //  GetBluetoothPermission()
// }, false)

document.addEventListener('keydown', function(event) {
  //Tornar um padrão mais prático
  if(event.code == 'Space' && CurrentStatus == Game_Status.ONBOARDING){
    setGameStatus(Game_Status.INTROVIDEO)
    // CurrentStatus = Game_Status.PLAYING
  }
  if(event.ctrlKey && event.shiftKey && event.key === 'E'){
    if(current_state % 2 == 0 && current_state < 13){
      current_state ++;
      current_password ++;
      current_text_line1 = "OPPGAVE "+taks_names[current_state];
      current_text_line2 = ""

      bottom_text_line1 = ""
      bottom_text_line2 = ""
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
  specialMessageTimer = 3;
  if(rightPassword){
    if(!isNaN(inputBox.value)){
      fullCode += "#";
    }
    fullCode += inputBox.value.toUpperCase();
    specialMessageBottomBar = "RIKTIG"


    if(current_password == 6){
      current_text_line1 = "TID:"
        current_text_line2 = timer.getFinalTime()
    }else if(current_state % 4 == 1){
      current_text_line1 = "FÅ PULSEN"
      current_text_line2 = "UNDER 95"

      bottom_text_line1 = "SENK STRESSNIVÅET"
      bottom_text_line2 = ""
    }else{
      current_text_line1 = "FÅ PULSEN"
      current_text_line2 = "OVER 120"

      bottom_text_line1 = "STRESSNIVÅET ØKER"
      bottom_text_line2 = "UNDER TIDSPRESS"
    }
    
    current_state ++;
  }else{
    specialMessageBottomBar = "FEIL"
  }
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
      break;
    case Game_Status.INTROVIDEO:
      startIntroVideo()
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