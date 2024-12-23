// import { Actor, HttpAgent } from "@dfinity/agent";
import { simple_todo_list_manager_backend } from "../../declarations/simple_todo_list_manager_backend";


window.addEventListener("load", function(){
    // console.log("Finished loading");
    const Availabletask = simple_todo_list_manager_backend.taskInput();
    document.getElementById("Task-list").innerText = Availabletask;
});