import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backendIdl } from "../../declarations/simple_todo_list_manager_backend/simple_todo_list_manager_backend.did.js";


// Initialize the actor
const agent = new HttpAgent();
const actor = Actor.createActor(backendIdl, {
  agent,
  canisterId: "bkyz2-fmaaa-aaaaa-qaaaq-cai",
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  // Function to load tasks
  const loadTasks = async () => {
    try {
      const tasks = await actor.taskView();
      taskList.innerHTML = ""; // Clear existing tasks
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.classList.add(task.isCompleted ? "completed" : "");
        li.textContent = task.description;

        // Complete Button
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Complete";
        completeBtn.classList.add("complete");
        completeBtn.disabled = task.isCompleted; // Disable if already completed
        completeBtn.addEventListener("click", async () => {
          const result = await actor.markCompleted(task.description);
          if ("ok" in result) {
            alert(result.ok);
          } else {
            alert(`Error: ${result.err}`);
          }
          loadTasks();
        });

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete");
        deleteBtn.addEventListener("click", async () => {
          const result = await actor.resetTask(task.description);
          if ("ok" in result) {
            alert(result.ok);
          } else {
            alert(`Error: ${result.err}`);
          }
          loadTasks();
        });

        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  // Handle form submission to add a new task
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskDescription = taskInput.value.trim();
    if (taskDescription) {
      try {
        const result = await actor.taskDescription(taskDescription);
        alert(result); // Show success message
        taskInput.value = ""; // Clear input
        loadTasks(); // Reload tasks
      } catch (error) {
        console.error("Error adding task:", error);
      }
    } else {
      alert("Task description cannot be empty!");
    }
  });

  // Load tasks on page load
  loadTasks();
});
