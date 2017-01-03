# Lambda invoker

[![Build Status](https://travis-ci.org/Palmabit-IT/lambda-invoker.svg?branch=master)](https://travis-ci.org/Palmabit-IT/lambda-invoker)
[![Known Vulnerabilities](https://snyk.io/test/github/Palmabit-IT/lambda-invoker/badge.svg)](https://snyk.io/test/github/Palmabit-IT/lambda-invoker)
[![https://david-dm.org/Palmabit-IT/lambda-invoker.svg](https://david-dm.org/Palmabit-IT/lambda-invoker.svg)](https://david-dm.org/Palmabit-IT/lambda-invoker.svg)

A class to invoke an AWS Lambda function from an other

## Installation

```
npm install lambda-invoker --save
```

## Usage

### Callback

```js
const AWS = require('aws-sdk')
const LambdaInvoker = require('lambda-invoker')

const invoker = new LambdaInvoker(new AWS.Lambda())

invoker.invoke(<lambda-arn>, <payload>, (err, data) => {
    //...
})
```

### Promise

```js
invoker.invoke(<lambda-arn>, <payload>)
    .then(response => { /*...*/ })
    .catch(err => { /*...*/ })
```

## Errors

### No lambda arn name provided

```
{statusCode: 400, message: "No function name"}
```

### No payload response from invoked lambda

```
{statusCode: 400, message: "Can't get payload"}
```

### Errors from invoked lambda

```
{statusCode: <status-code-from-lambda>, message: <error-message-from-lambda>}
```


## Tests
```
npm test
```

### Coverage

```
npm run-script test-travis
```

## Author

[Palmabit](https://palmabit.com)

## License

[MIT license](LICENSE)
