# Lambda invoker

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
