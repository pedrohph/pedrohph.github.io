class TaskReader{
    tasks = [];

    path = "resources/tasks.json"

    constructor(){
        this.readTaskFiles()
    }

    readTaskFiles(){
        fetch(this.path)
            //landscape
            .then((res) => res.json())
            .then((data) => {
                this.tasks = data["tasks"]
                console.log("Tasks ready")
            });
    }

    setTaskFiles(){
        this.tasks[0].Goal= 10;
        this.tasks[0].Tittle_line_1 = "OVER 10";
        console.log("Entrou aqui")

        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        data.Goal = 'new value'; // Modify value
        fs.writeFileSync('file.json', JSON.stringify(data, null, 2));
        
    }

    getTasks(){
        return this.tasks;
    }

    getTasksById(id){
        return this.tasks[id];
    }
}

export default TaskReader;