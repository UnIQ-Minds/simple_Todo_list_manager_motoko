import List "mo:base/List";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Result "mo:base/Result";

actor simple_todo_task_manager_backend{
    type Task = {
        description : Text;
        isCompleted : Bool;
    };

    stable var taskInput : List.List<Task> = List.nil<Task>();

    public func taskDescription(taskin : Text) : async Text {
        let newTask : Task = { description = taskin; isCompleted = false };
        taskInput := List.push(newTask, taskInput);
        return "Task added successfully!";
    };
    public func taskView() : async [Task] {
        return List.toArray(taskInput);
    };
    public func markCompleted(descrip : Text) : async Result.Result<Text, Text> {
        let taskFound = List.find<Task>(
            taskInput,
            func(task : Task) : Bool { task.description == descrip },
        );

        switch (taskFound) {
            case (?task) {
                taskInput := List.map<Task, Task>(
                    taskInput,
                    func(task : Task) : Task {
                        if (task.description == descrip) {
                            return {
                                description = task.description;
                                isCompleted = true;
                            };
                        } else {
                            task;
                        };
                    },
                );
                return #ok("Task '" # descrip # "' marked as completed.");
            };
            case null {
                return #err("Task '" # descrip # "' not found.");
            };
        };
    };

    public func resetTask(descrip2 : Text) : async Result.Result<Text, Text> {
        let taskExists = List.find<Task>(
            taskInput,
            func(task : Task) : Bool { task.description == descrip2 },
        );

        switch (taskExists) {
            case (?task) {
                taskInput := List.filter<Task>(
                    taskInput,
                    func(task : Task) : Bool {
                        task.description != descrip2;
                    },
                );
                return #ok("Task '" # descrip2 # "' deleted successfully.");
            };
            case null {
                return #err("Task '" # descrip2 # "' not found.");
            };
        };
    };
};
