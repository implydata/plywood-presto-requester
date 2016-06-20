// Type definitions for request
// Project: https://github.com/mikeal/request
// Definitions by: Carlos Ballesteros Velasco <https://github.com/soywiz>, bonnici <https://github.com/bonnici>, Bart van der Schoor <https://github.com/Bartvds>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// Imported from: https://github.com/soywiz/typescript-node-definitions/d.ts

/// <reference path="./node/node.d.ts" />
/// <reference path="./form-data/form-data.d.ts" />

declare module 'presto-client' {
  import http = require('http');

  export class Client {
    constructor(opts: Object);
    request(opts: Object, callback: () => void): any;
    nodes(opts: Object, callback: () => void): any;
    query(opts: Object, callback: () => void): any;
    kill(opts: Object, callback: () => void): any;
    execute(opts: Object, callback: (err: any, data: any, columns?: any) => void): any;
    executeResource(opts: Object, callback: () => void): any;
    statementResource(opts: Object, callback: () => void): any;
  }
}
