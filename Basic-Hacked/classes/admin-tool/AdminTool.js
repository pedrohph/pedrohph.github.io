class AdminTool{
    cancelButtonEvent = new CustomEvent('cancelAdminChanges');
    confirmButtonEvent = new CustomEvent('confirmAdminChanges');

    mainContainer = document.getElementById('admin-tool-container');
    newTimeInput = document.getElementById('new-game-time');

    confirmButton = document.getElementById('button-confirm-admin-tool');
    cancelButton = document.getElementById('button-cancel-admin-tool');

    leftButton = document.getElementById('button-left-admin-tool')
    rightButton = document.getElementById('button-right-admin-tool')

    passwordInputs = document.getElementById('password-input')
    taskPulseInput = document.getElementById('task-pulse-value');
    
    envelopCode = document.getElementById('konvolutt-code')
    pulseTaskType = document.getElementById('task-pulse-style')

    currentTask = 0;
    taskText = []

    newTime = 60;
    pulseValues = []
    passwordValues = []

    envelopCodeList = [];
    pulseTaskList = [];

    constructor(){
        this.addListeners();
    }

    addListeners(){
        this.confirmButton.addEventListener('click', () =>{
            this.confirmButtonAction();
        })

        this.cancelButton.addEventListener('click', () =>{
            this.cancelButtonAction();
        })

        
        this.leftButton.addEventListener('click', () =>{
            this.leftButtonAction();
        })

        this.rightButton.addEventListener('click', () =>{
            this.rightButtonAction();
        })

    }

    openScreen(pulseList, passwordList, codeList, pulseTypeList){
       this.mainContainer.classList.remove('hidden')
       this.currentTask = 0;

        this.envelopCodeList = codeList;
        this.pulseTaskList = pulseTypeList;

       this.pulseValues = pulseList;
       this.passwordValues = passwordList;

        this.leftButton.classList.add('hidden')
        this.rightButton.classList.remove('hidden')

        this.newTimeInput.value = this.newTime;
        
        this.refreshCurrentTask();
    }

    refreshCurrentTask(){
        console.log(this.envelopCode)

        this.envelopCode.innerHTML = "Konvolutt " +this.envelopCodeList[this.currentTask];

        if(this.pulseTaskList[this.currentTask] == 0){
            this.pulseTaskType.innerHTML = "Lagpuls over";
        }else{
            this.pulseTaskType.innerHTML = "Lagpuls under";
        }

        
        this.passwordInputs.value = this.passwordValues[this.currentTask];
        this.taskPulseInput.value = this.pulseValues[this.currentTask]
        //Refresh labels
    }


    confirmButtonAction(){
        let splitedPasswords = this.passwordInputs.value.toUpperCase().split(',');

         this.passwordValues[this.currentTask] = []
        splitedPasswords.forEach(np => {
             this.passwordValues[this.currentTask].push(np.trim());
        })

        this.pulseValues[this.currentTask] = this.taskPulseInput.value;

        this.newTime = this.newTimeInput.value;

        this.mainContainer.classList.add('hidden')
        document.dispatchEvent(this.confirmButtonEvent);

    }

    getTaskPasswords(taskCode, newPassword){

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

    cancelButtonAction(){
        this.mainContainer.classList.add('hidden')
        document.dispatchEvent(this.cancelButtonEvent);

    }


    leftButtonAction(){
         let splitedPasswords = this.passwordInputs.value.toUpperCase().split(',');

         this.passwordValues[this.currentTask] = []
        splitedPasswords.forEach(np => {
             this.passwordValues[this.currentTask].push(np.trim());
        })

        this.pulseValues[this.currentTask] = this.taskPulseInput.value;

        this.currentTask -= 1;
        if(this.currentTask <= 0){
            this.currentTask = 0;

            this.leftButton.classList.add('hidden')
        }

        this.rightButton.classList.remove('hidden')


        this.refreshCurrentTask();
    }

    rightButtonAction(){
       let splitedPasswords = this.passwordInputs.value.toUpperCase().split(',');

         this.passwordValues[this.currentTask] = []
        splitedPasswords.forEach(np => {
             this.passwordValues[this.currentTask].push(np.trim());
        })

        this.pulseValues[this.currentTask] = this.taskPulseInput.value;

        this.currentTask += 1;
        if(this.currentTask >= this.passwordValues.length-1){
            this.currentTask = this.passwordValues.length -1;

            this.rightButton.classList.add('hidden')
        }

        this.leftButton.classList.remove('hidden')


        this.refreshCurrentTask();
    }

}

export default AdminTool;