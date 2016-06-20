var { expect } = require("chai");

var { prestoRequesterFactory } = require('../build/prestoRequester');

var info = require('./info');

var prestoRequester = prestoRequesterFactory({
  host: info.prestoHost,
  catalog: info.prestoCatalog,
  schema: info.prestoSchema,
  user: info.prestoUser,
  password: info.prestoPassword
});

describe("Presto requester", function() {
  this.timeout(5 * 1000);

  describe("error", function() {
    it("throws if there is not host or locator", function() {
      expect(() => {
        prestoRequesterFactory({});
      }).to.throw('must have a `host` or a `locator`');
    });

    it("correct error for bad table", (testComplete) => {
      prestoRequester({
        query: "SELECT * FROM not_a_real_datasource"
      })
        .then(() => {
          throw new Error('DID_NOT_ERROR');
        })
        .catch((err) => {
          expect(err.message).to.contain("ER_NO_SUCH_TABLE");
          testComplete();
        })
        .done();
    });
  });


  describe("basic working", function() {
    it("runs a DESCRIBE", (testComplete) => {
      prestoRequester({
        query: "DESCRIBE wikipedia;"
      })
        .then((res) => {
          expect(res.length).to.equal(26);
          testComplete();
        })
        .done();
    });


    it("runs a SELECT / GROUP BY", (testComplete) => {
      prestoRequester({
        query: 'SELECT `channel` AS "Channel", sum(`added`) AS "TotalAdded", sum(`deleted`) AS "TotalDeleted" FROM `wikipedia` WHERE `cityName` = "Tokyo" GROUP BY `channel`;'
      })
        .then((res) => {
          expect(res).to.deep.equal([
            {
              "Channel": "de",
              "TotalAdded": 0,
              "TotalDeleted": 109
            },
            {
              "Channel": "en",
              "TotalAdded": 3500,
              "TotalDeleted": 447
            },
            {
              "Channel": "fr",
              "TotalAdded": 0,
              "TotalDeleted": 0
            },
            {
              "Channel": "ja",
              "TotalAdded": 75168,
              "TotalDeleted": 2462
            },
            {
              "Channel": "ko",
              "TotalAdded": 0,
              "TotalDeleted": 57
            },
            {
              "Channel": "ru",
              "TotalAdded": 898,
              "TotalDeleted": 194
            },
            {
              "Channel": "zh",
              "TotalAdded": 72,
              "TotalDeleted": 21
            }
          ]);
          testComplete();
        })
        .done();
    });

    it("works correctly with time", (testComplete) => {
      prestoRequester({
        query: 'SELECT MAX(`time`) AS "MaxTime" FROM `wikipedia` GROUP BY ""'
      })
        .then((res) => {
          expect(res).to.deep.equal([
            {
              "MaxTime": new Date('2015-09-12T23:59:00.000Z')
            }
          ]);
          testComplete();
        })
        .done();
    })
  });
});
