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
import { nanoid } from 'nanoid';
import moment from 'moment';
import { UNIQUE_START_DELAY, UNIQUE_POOLING } from '../../constants';

/**
 * List of uniques sessions was executed
 */

/** Callback function */
export type UniqueExecutionCallback = () => Promise<void> | void;

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
    createdAt: moment.Moment;
    /** When executed  */
    whenExecuted?: moment.Moment;
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

/** Tasks list manager dataset */
interface Manager {
    queue: ExecutionManager[];
    interval?: NodeJS.Timeout;
}

const manager: Manager = {
    queue: [],
};

const isUnique = (name: string) => manager.queue.findIndex((v) => v.name === name) === -1;
const isAllDone = () => manager.queue.reduce((acc, cur) => cur.done && acc, true);

/**
 * Stop manager execution because have no more tasks to monitoring
 */
export const stopManager = (): void => {
    if (manager.interval) clearInterval(manager.interval);
    manager.interval = undefined;
};

/**
 * After schedule a new task, the manager is started to handle (if have more or not tasks to group).
 */
export const startManager = (): void => {
    // eslint-disable-next-line no-use-before-define
    if (!manager.interval) manager.interval = setInterval(() => runTasks(), UNIQUE_POOLING);
};

/**
 * Execute all scheduled tasks in this turn
 */
async function runTasks() {
    stopManager();
    const nextTask = manager.queue
        .filter((v) => !v.done)
        .filter((v) => moment().diff(v.createdAt) > v.delay)
        .sort((a, b) => a.priority - b.priority);
    for (let x = 0; x < nextTask.length; x += 1) {
        const task = nextTask[x];
        try {
            // eslint-disable-next-line no-await-in-loop
            await task.func();
        } catch (err) {
            task.failed.status = true;
            task.failed.message = err.toString();
            if (task.failed.func) {
                // eslint-disable-next-line no-await-in-loop
                await task.failed.func();
            }
        }
        task.done = true;
        task.whenExecuted = moment();
    }
    if (!isAllDone()) startManager();
}

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
export const uniqueExecution = (options: uniqueExecutionOptions): void => {
    const { name: optName, callback, onFailCallback, advanced } = options;
    const name = optName || nanoid();
    const resultOptions: ExecutionOptions = {
        delay: UNIQUE_START_DELAY,
        blockExecution: false,
        priority: 9999,
        ...advanced,
    };
    if (isUnique(name)) {
        manager.queue.push({
            name,
            done: false,
            failed: {
                status: false,
                func: onFailCallback,
            },
            createdAt: moment(),
            func: callback,
            ...resultOptions,
        });
        startManager();
    }
};

/**
 * List uniqueExecution queue
 */
export const uniqueQueue = (): ExecutionManager[] => manager.queue;
