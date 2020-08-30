"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueQueue = exports.uniqueExecution = exports.startManager = exports.stopManager = void 0;
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
var nanoid_1 = require("nanoid");
var moment_1 = __importDefault(require("moment"));
var constants_1 = require("../../constants");
var manager = {
    queue: [],
};
var isUnique = function (name) { return manager.queue.findIndex(function (v) { return v.name === name; }) === -1; };
var isAllDone = function () { return manager.queue.reduce(function (acc, cur) { return cur.done && acc; }, true); };
/**
 * Stop manager execution because have no more tasks to monitoring
 */
exports.stopManager = function () {
    if (manager.interval)
        clearInterval(manager.interval);
    manager.interval = undefined;
};
/**
 * After schedule a new task, the manager is started to handle (if have more or not tasks to group).
 */
exports.startManager = function () {
    // eslint-disable-next-line no-use-before-define
    if (!manager.interval)
        manager.interval = setInterval(function () { return runTasks(); }, constants_1.UNIQUE_POOLING);
};
/**
 * Execute all scheduled tasks in this turn
 */
function runTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var nextTask, x, task, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exports.stopManager();
                    nextTask = manager.queue
                        .filter(function (v) { return !v.done; })
                        .filter(function (v) { return moment_1.default().diff(v.createdAt) > v.delay; })
                        .sort(function (a, b) { return a.priority - b.priority; });
                    x = 0;
                    _a.label = 1;
                case 1:
                    if (!(x < nextTask.length)) return [3 /*break*/, 9];
                    task = nextTask[x];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 7]);
                    // eslint-disable-next-line no-await-in-loop
                    return [4 /*yield*/, task.func()];
                case 3:
                    // eslint-disable-next-line no-await-in-loop
                    _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    err_1 = _a.sent();
                    task.failed.status = true;
                    task.failed.message = err_1.toString();
                    if (!task.failed.func) return [3 /*break*/, 6];
                    // eslint-disable-next-line no-await-in-loop
                    return [4 /*yield*/, task.failed.func()];
                case 5:
                    // eslint-disable-next-line no-await-in-loop
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 7];
                case 7:
                    task.done = true;
                    task.whenExecuted = moment_1.default();
                    _a.label = 8;
                case 8:
                    x += 1;
                    return [3 /*break*/, 1];
                case 9:
                    if (!isAllDone())
                        exports.startManager();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Schedule a function to be run only one time during the app execution.
 * @param options named parameters options
 */
exports.uniqueExecution = function (options) {
    var optName = options.name, callback = options.callback, onFailCallback = options.onFailCallback, advanced = options.advanced;
    var name = optName || nanoid_1.nanoid();
    var resultOptions = __assign({ delay: constants_1.UNIQUE_START_DELAY, blockExecution: false, priority: 9999 }, advanced);
    if (isUnique(name)) {
        manager.queue.push(__assign({ name: name, done: false, failed: {
                status: false,
                func: onFailCallback,
            }, createdAt: moment_1.default(), func: callback }, resultOptions));
        exports.startManager();
    }
};
/**
 * List uniqueExecution queue
 */
exports.uniqueQueue = function () { return manager.queue; };
//# sourceMappingURL=index.js.map