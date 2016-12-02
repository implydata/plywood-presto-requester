# plywood-mysql-requester

This is the [MySQL](https://www.mysql.com/) requester making abstraction layer for [plywood](https://github.com/implydata/plywood).

Given a MySQL query and an optional context it return a Q promise that resolves to the data table.

## Installation

To install run:

```
npm install plywood-mysql-requester
```

## Usage

In the raw you could use this library like so:

```
mySqlRequesterGenerator = require('plywood-mysql-requester').mySqlRequester

mySqlRequester = mySqlRequesterGenerator({
  host: 'my.mysql.host',
  database: 'all_my_data',
  user: 'HeMan',
  password: 'By_the_Power_of_Greyskull'
})

mySqlRequester({
  query: 'SELECT `cut` AS "Cut", sum(`price`) AS "TotalPrice" FROM `diamonds` GROUP BY `cut`;'
})
  .then(function(res) {
    console.log("The first row is:", res[0])
  })
  .done()
```

Although usually you would just pass `mySqlRequester` into the MySQL driver that is part of Plywood.

## Tests

Currently the tests run against a real MySQL database that should be configured (database, user, password) the same as
what is indicated in `test/info.coffee`.
