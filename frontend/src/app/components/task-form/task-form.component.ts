import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
    selector: 'app-task-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
    taskForm: FormGroup;
    isEditMode = false;
    taskId: string | null = null;
    submitted = false;

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.taskForm = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            priority: ['medium', Validators.required],
            dueDate: [''],
            status: ['pending']
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.taskId = params.get('id');
            if (this.taskId) {
                this.isEditMode = true;
                this.loadTask(this.taskId);
            }
        });
    }

    loadTask(id: string): void {
        this.taskService.getTask(id).subscribe({
            next: (task) => {
                // Format date for input type="datetime-local" (YYYY-MM-DDTHH:mm)
                let formattedDate = '';
                if (task.dueDate) {
                    formattedDate = new Date(task.dueDate).toISOString().slice(0, 16);
                }

                this.taskForm.patchValue({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    dueDate: formattedDate
                });
            },
            error: (e) => console.error(e)
        });
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.taskForm.invalid) {
            return;
        }

        const taskData: Task = this.taskForm.value;

        if (this.isEditMode && this.taskId) {
            this.taskService.updateTask(this.taskId, taskData).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (e) => console.error(e)
            });
        } else {
            this.taskService.createTask(taskData).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (e) => console.error(e)
            });
        }
    }
}
