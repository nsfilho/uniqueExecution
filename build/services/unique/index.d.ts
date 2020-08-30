import moment from 'moment';
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
