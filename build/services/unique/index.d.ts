/**
 * Unique Execution Library
 * Copyright (C) 2020 E01-AIO Automação Ltda.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Author: Nelio Santos <nsfilho@icloud.com>
 *
 */
import dayjs from 'dayjs';
/**
 * List of uniques sessions was executed
 */
/** Callback function */
export declare type UniqueExecutionCallback = () => Promise<void> | void;
interface ExecutionOptions {
    /** Delay to start this task. Default comes from: `process.env.UNIQUE_POOLING` or 1 secs. */
    delay: number;
    /** Priority to dequeue tasks. Major number is less important. Maximum priority is 0 */
    priority: number;
    /** Guarantee a isolated execution for a task */
    blockExecution: boolean;
}
/** Execution Manager is a interface to define each queued task */
interface ExecutionManager extends ExecutionOptions {
    /** task name */
    name: string;
    /** executed (yes or no) */
    done: boolean;
    /** When created */
    createdAt: dayjs.Dayjs;
    /** When executed  */
    whenExecuted?: dayjs.Dayjs;
    /** Callback async function */
    func: UniqueExecutionCallback;
    /** Execution failed, because result a throw */
    failed: {
        /** failed? true or false */
        status: boolean;
        /** message */
        message?: string;
        /** onFail Callback */
        func?: UniqueExecutionCallback;
    };
}
/**
 * Stop manager execution because have no more tasks to monitoring
 */
export declare const stopManager: () => void;
/**
 * After schedule a new task, the manager is started to handle (if have more or not tasks to group).
 */
export declare const startManager: () => void;
export interface uniqueExecutionOptions {
    /** task name or a generated id */
    name?: string;
    /** Async function to execute unique */
    callback: UniqueExecutionCallback;
    /** If callback fail, callback this async function */
    onFailCallback?: UniqueExecutionCallback;
    /** optional advanced tuning options */
    advanced?: ExecutionOptions;
}
/**
 * Schedule a function to be run only one time during the app execution.
 * @param options named parameters options
 */
export declare const uniqueExecution: (options: uniqueExecutionOptions) => void;
/**
 * List uniqueExecution queue
 */
export declare const uniqueQueue: () => ExecutionManager[];
export {};
