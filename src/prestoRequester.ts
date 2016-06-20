/// <reference path="../typings/q/Q.d.ts" />
/// <reference path="../typings/presto-client.d.ts" />
/// <reference path="../definitions/locator.d.ts" />
/// <reference path="../definitions/requester.d.ts" />

import presto = require("presto-client");
import Q = require('q');

export interface PrestoRequesterParameters {
  locator?: Locator.PlywoodLocator;
  host?: string;
  user: string;
  password: string;
  catalog: string;
  schema: string;
}

function basicLocator(host: string): Locator.PlywoodLocator {
  var hostnamePort = host.split(':');
  var hostname: string;
  var port: number;
  if (hostnamePort.length > 1) {
    hostname = hostnamePort[0];
    port = Number(hostnamePort[1]);
  } else {
    hostname = hostnamePort[0];
    port = 3306;
  }
  return () => {
    return Q({
      hostname: hostname,
      port: port
    });
  };
}

export function prestoRequesterFactory(parameters: PrestoRequesterParameters): Requester.PlywoodRequester<string> {
  var locator = parameters.locator;
  if (!locator) {
    var host = parameters.host;
    if (!host) throw new Error("must have a `host` or a `locator`");
    locator = basicLocator(host);
  }
  var user = parameters.user;
  var password = parameters.password;
  var catalog = parameters.catalog;
  var schema = parameters.schema;

  return (request): Q.Promise<any[]> => {
    var query = request.query;
    return locator()
      .then((location) => {
        var connection = new presto.Client({
          host: location.hostname,
          port: location.port || 3306,
          user: user,
          password: password,
          catalog: catalog,
          schema: schema,
          charset: 'UTF8_BIN',
          timezone: '+00:00',
        });

        var deferred = <Q.Deferred<any[]>>(Q.defer());
        connection.execute(query, (err, data, columns) => {
          var rows = data.map((row: any) => row.reduce((memo: any, col: any, i:any) => {
              memo[columns[i].name] = col;
              return memo;
            }, {})
          );
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(rows);
          }
        });
        return deferred.promise;
      });
  };
}
