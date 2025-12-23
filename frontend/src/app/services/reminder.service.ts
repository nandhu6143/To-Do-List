import { Injectable } from '@angular/core';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class ReminderService {
    private tasks: Task[] = [];
    private intervalId: any;
    private notifiedTaskIds: Set<string> = new Set();

    constructor(private taskService: TaskService) {
        this.requestPermission();
    }

    startMonitoring(): void {
        this.refreshTasks();
        // Poll every 60 seconds
        this.intervalId = setInterval(() => {
            this.checkTasks();
        }, 60000);

        // Refresh task list every 5 minutes to get new/updated tasks
        setInterval(() => {
            this.refreshTasks();
        }, 300000);
    }

    stopMonitoring(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    private requestPermission(): void {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    private refreshTasks(): void {
        this.taskService.getTasks().subscribe(tasks => {
            this.tasks = tasks.filter(t => t.status !== 'completed' && t.dueDate);
        });
    }

    private checkTasks(): void {
        const now = new Date();
        const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000);

        this.tasks.forEach(task => {
            if (task.dueDate && !this.notifiedTaskIds.has(task._id!)) {
                const dueDate = new Date(task.dueDate);

                // Check if task is due between now and 15 mins from now
                if (dueDate > now && dueDate <= fifteenMinutesLater) {
                    this.sendNotification(task);
                    this.notifiedTaskIds.add(task._id!);
                }
            }
        });
    }

    private sendNotification(task: Task): void {
        if (Notification.permission === 'granted') {
            new Notification('Task Reminder', {
                body: `Task "${task.title}" is due soon!`,
                icon: '/favicon.ico'
            });
        }
    }
}
