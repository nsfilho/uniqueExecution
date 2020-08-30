"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNIQUE_POOLING = exports.UNIQUE_START_DELAY = void 0;
/** Delay for start a execution (after scheduling) */
exports.UNIQUE_START_DELAY = process.env.UNIQUE_START_DELAY
    ? parseInt(process.env.UNIQUE_START_DELAY, 10)
    : 1 * 1000;
/** Pooling for checking new executions (with delay) */
exports.UNIQUE_POOLING = process.env.UNIQUE_POOLING ? parseInt(process.env.UNIQUE_POOLING, 10) : 1 * 1000;
//# sourceMappingURL=unique.js.map