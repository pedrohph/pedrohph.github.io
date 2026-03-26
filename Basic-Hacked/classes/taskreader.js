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

    getTasks(){
        return this.tasks;
    }

    getTasksById(id){
        return this.tasks[id];
    }
}

export default TaskReader;