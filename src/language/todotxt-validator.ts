import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { TodotxtAstType, TodoFile, Task, CompletedTask, IncompleteTask } from './generated/ast.js';
import type { TodotxtServices } from './todotxt-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: TodotxtServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.TodotxtValidator;
    const checks: ValidationChecks<TodotxtAstType> = {
        TodoFile: validator.checkTodoFile,
        Task: validator.checkTask,
        CompletedTask: validator.checkCompletedTask,
        IncompleteTask: validator.checkIncompleteTask
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class TodotxtValidator {

    checkTodoFile(todoFile: TodoFile, accept: ValidationAcceptor): void {
        // Additional checks for the TodoFile can be implemented here
    }

    checkTask(task: Task, accept: ValidationAcceptor): void {
        // Checks that are common for both Completed and Incomplete tasks
    }

    checkCompletedTask(task: CompletedTask, accept: ValidationAcceptor): void {
        if (task.dates?.completionDate && task.dates?.creationDate && task.dates?.completionDate < task.dates?.creationDate) {
            accept('error', 'Completion date must be after creation date.', { node: task.dates, property: 'completionDate' });
        }
    }

    checkIncompleteTask(task: IncompleteTask, accept: ValidationAcceptor): void {
        // Example check for priority validation
        if (task.priority && !/^\([A-Z]\)$/.test(task.priority)) {
            accept('error', 'Priority must be an uppercase letter enclosed in parentheses.', { node: task, property: 'priority' });
        }

        // Check for the correct format of a creation date
        if (task.dates?.creationDate && !/^\d{4}-\d{2}-\d{2}$/.test(task.dates?.creationDate)) {
            accept('error', 'Creation date must be in the format YYYY-MM-DD.', { node: task.dates, property: 'creationDate' });
        }

        // Check there is no completion date
        if (task.dates?.completionDate) {
            accept('error', 'Completion date may not be set for an incomplete task.', { node: task.dates, property: 'completionDate' });
        }

        // Additional checks for contexts and projects could be added here
    }

    // Other validation methods...
}
