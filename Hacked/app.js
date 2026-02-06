let device_list = []
let bpm_values = []

let higherBPM = -1;
let lowerBPM = 256;
let averageBPM = -1;
let devicesConnected = 0;

let current_state = 0;
let current_task = '-'
let current_text_line1 = "PULSE OPP"
let current_text_line2 = "TIL 130"

let time_left = 3599;
let lastTime = new Date();
let deltaTime = 0;
let start_timer = false;


const canvas = document.getElementById("main-canvas")
const context = canvas.getContext("2d")

let backgroundImage;
let centerImagePulse;
let centerImageEnvelope;
let boxCenter;
let textBoxTop;
let textBoxBottom;
let textBoxLeft;
let textBoxRightTop;
let textBoxRightBottom;

setup();

function setup() {
  navigator.permissions.query({ name: "Bluetooth" }).then(console.log("Ok")).catch("Error!")
  canvas.width=1280
  canvas.height= 720
  loadBoxes()
  update();
 
}

function update(){
  requestAnimationFrame(update)
  calculateDeltaTime()

  if(start_timer)
    time_left -= deltaTime

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground()
  drawGoalImages()
  getHigherAndLower()
  console.log("Total devices connected: "+devicesConnected)

  checkObjective()

  context.fillStyle = "green";
  context.strokeStyle = "black";
  context.textAlign = "center";
  context.lineWidth = 3;
  context.font = "normal 40px Alarm_Clock";
  context.fillText("TEAM PULS",  canvas.width - 905 * 0.25, canvas.height*0.5 - 450*0.23 )
  context.fillText(averageBPM,  canvas.width - 905 * 0.25, canvas.height*0.5 - 450*0.23 + 50)

  if(higherBPM > 1){
    context.fillText("H: " +higherBPM,  canvas.width - 935 * 0.25, canvas.height*0.62)
  }else{
    context.fillText("H: --", canvas.width - 935 * 0.25, canvas.height*0.62)

  }
  if(lowerBPM > 1){
    context.fillText("L: " +lowerBPM,  canvas.width - 935 * 0.25, canvas.height*0.62+50)

  }else{
    context.fillText("L: --",  canvas.width - 935 * 0.25, canvas.height*0.62+50)

  }
  context.font = "normal 75px Alarm_Clock";
  context.fillText((Math.floor((time_left % 3600) / 60).toString().padStart(2, '0'))+":"+(Math.floor(time_left) % 60).toString().padStart(2, '0'),  canvas.width * 0.14, canvas.height*0.57)

  context.fillStyle = "white";
  context.font = "normal 50px Alarm_Clock";
  context.fillText(current_text_line1, canvas.width/2, canvas.height/2 - 125)
  context.fillText(current_text_line2, canvas.width/2, canvas.height/2 - 75)


  
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
  switch(current_state){
    case 0:
      if(averageBPM >= 130 && averageBPM > 0){
        current_text_line1 = "OPPGAVEN B"
        current_text_line2 = ""
        current_state = 1;
        current_task = 'b';
      }
      break;
    case 2:
      if(averageBPM <= 90 && averageBPM > 0){
         current_text_line1 = "OPPGAVEN F"
        current_text_line2 = ""
        current_state = 3;
        current_task = 'f';
      }
      break;
  }
}

function loadBoxes(){
  boxCenter = new Image()
  boxCenter.src = "assets/images/UI box center.png"

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
    centerImagePulse.src = "assets/images/pulse.PNG"

    centerImageEnvelope = new Image()
    centerImageEnvelope.src = "assets/images/envelope.PNG"
    return;
  }

  if(current_state == 4){
    return;
  }
  if(current_state % 2 == 0){
    context.drawImage(centerImagePulse, canvas.width * 0.5 - 981*0.2, canvas.height * 0.5 -  970*0.2 , 981*0.4, 970*0.4);
  }else{
    context.drawImage(centerImageEnvelope, canvas.width * 0.5 - 981*0.2, canvas.height * 0.5 -  970*0.2 , 981*0.4, 970*0.4);
  }
}

function drawTextBoxes(){
  if(boxCenter == undefined){
    return;
  }
  context.drawImage(boxCenter, canvas.width * 0.5 - 981*0.25, canvas.height * 0.5 -  970*0.25 , 981*0.5, 970*0.5);
  context.drawImage(textBoxTop, canvas.width * 0.5 - 1772*0.25, 0 , 1772*0.5, 265*0.5);
  context.drawImage(textBoxBottom, canvas.width * 0.5 - 1145*0.25, canvas.height - 237*0.5 , 1145*0.5, 237*0.5);
  context.drawImage(textBoxLeft, -50, canvas.height*0.6 - 937*0.25 , 854*0.5, 937*0.5);
  context.drawImage(textBoxRightTop, canvas.width - 935 * 0.5, canvas.height*0.5 - 450*0.5 , 844*0.5, 450*0.5);
  context.drawImage(textBoxRightBottom, canvas.width - 935 * 0.5, canvas.height*0.5, 935*0.5, 464*0.5);

}

canvas.addEventListener('click', (event) => {
   console.log("Clickou")
   GetBluetoothPermission()
})

// canvas.addEventListener("touchstart", (event) => {
//   //  console.log("Tocou")
//   //  GetBluetoothPermission()
// }, false)

document.addEventListener('keydown', function(event) {
  completeQuest(event.key)
});

function completeQuest(key){
  if(current_task=='-'){
    return;
  }
  if(key == current_task){
    current_text_line2 = "RIKTIG"

    if(current_task == 'b'){
      current_text_line1 = "PULSEN NED"
      current_text_line2 = "TIL 90"
    }else{
      current_text_line1 = "TID:"
      console.log(time_left)
      let m = 3599 - time_left;
      let s = 3599 - time_left;
      current_text_line2 = (Math.floor((m)/ 60).toString().padStart(2, '0'))+":"+(Math.ceil(s) % 60).toString().padStart(2, '0');
      start_timer = false;
    }

   current_task = '-'
   current_state += 1;
  }else{
    current_text_line2 = "FEIL"
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
            start_timer = true;
              heart_rate_measurement.addEventListener(
              "characteristicvaluechanged",
              async (event) => {
                let i = device_list.indexOf(device.id);
                if(i < device_list.length){
                  bpm_values[i] = event.target.value.getInt8(1)
                }
              },
            );
            heart_rate_measurement.startNotifications()
          }
        })
      })
    });
  })
  .catch((error) => console.error(`Something went wrong. ${error}`));
}

function calculateDeltaTime(){
    const currentTime = new Date();
    deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
}