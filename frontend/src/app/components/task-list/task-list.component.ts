import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
    tasks: Task[] = [];

    constructor(private taskService: TaskService) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.taskService.getTasks().subscribe({
            next: (data) => this.tasks = data,
            error: (e) => console.error(e)
        });
    }

    deleteTask(id: string): void {
        if (confirm('Are you sure you want to delete this task?')) {
            this.taskService.deleteTask(id).subscribe({
                next: () => {
                    this.tasks = this.tasks.filter(t => t._id !== id);
                },
                error: (e) => console.error(e)
            });
        }
    }

    toggleStatus(task: Task): void {
        const newStatus: Task['status'] = task.status === 'completed' ? 'pending' : 'completed';
        // Ideally we update only status, here we send the whole object with updated status
        const updatedTask: Task = { ...task, status: newStatus };

        // Optimistic update
        task.status = newStatus;

        if (task._id) {
            this.taskService.updateTask(task._id, updatedTask).subscribe({
                error: (e) => {
                    console.error(e);
                    // Revert on error
                    task.status = task.status === 'completed' ? 'pending' : 'completed';
                }
            });
        }
    }
}
