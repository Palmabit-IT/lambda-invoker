'use strict'

const chai = require('chai')
const expect = chai.expect
const faker = require('faker')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

const LambdaInvoker = require('../src/lambdaInvoker')

describe('lambdaInvoke tests', () => {
  let lambdaInvoker, lambdaMock, functionNameStub, payloadStub

  beforeEach(done => {
    functionNameStub = faker.lorem.word()

    lambdaMock = {
      invoke: sinon.spy()
    }

    payloadStub = {
      foo: faker.lorem.word(),
      bar: faker.lorem.word()
    }

    lambdaInvoker = new LambdaInvoker(lambdaMock)

    done()
  })

  it('should call Lambda.invoke function', done => {
    lambdaInvoker.invoke(functionNameStub, payloadStub)

    expect(lambdaMock.invoke).to.be.calledOnce.calledWith({
      FunctionName: functionNameStub,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(payloadStub)
    })
    done()
  })

  it('should get error if lambdaInvoke is called without function name', done => {
    const callback = sinon.spy()

    lambdaInvoker.invoke('', null, callback)

    expect(callback).to.be.calledOnce.calledWith(lambdaInvoker.errNoName)
    done()
  })

  it('should parse payload', done => {
    const fakePayload = {foo: 'bar'}

    expect(lambdaInvoker.parsePayload(fakePayload)).to.deep.equal(fakePayload)
    expect(lambdaInvoker.parsePayload(JSON.stringify(fakePayload))).to.deep.equal(fakePayload)
    done()
  })

  it('should not parse payload if it isn\'t a valid stringified object', done => {
    const fakePayload = faker.lorem.word()

    expect(lambdaInvoker.parsePayload(fakePayload)).to.deep.equal(fakePayload)
    done()
  })

  it('should find errors in payload', done => {
    expect(lambdaInvoker.hasError({errorMessage: faker.lorem.word()})).to.be.true;
    done()
  })

  it('should format error from string', done => {
    const error = faker.lorem.word()

    expect(lambdaInvoker.fomatError(error)).to.deep.equal({
      statusCode: 400,
      message: error
    });
    done()
  })

  it('should format error from object', done => {
    const error = {statusCode: 403, message: faker.lorem.word()}

    expect(lambdaInvoker.fomatError(error)).to.deep.equal(error);
    done()
  })

  describe('callback tests', () => {
    it('should get error by invoked lambda', done => {
      const fakeError = {statusCode: faker.random.number(), message: faker.lorem.word()}

      lambdaInvoker = new LambdaInvoker({
        invoke: (params, cb) => {
          cb(fakeError)
        }
      })

      lambdaInvoker.invoke(functionNameStub, null, (err) => {
        expect(err).to.be.deep.equal(fakeError)
        done()
      })
    })

    it('should get error if invoked lambda doesn\'t return a payload', done => {
      lambdaInvoker = new LambdaInvoker({
        invoke: (params, cb) => {
          cb(null, {})
        }
      })

      lambdaInvoker.invoke(functionNameStub, null, (err) => {
        expect(err).to.be.deep.equal(lambdaInvoker.errNoPayload)
        done()
      })
    })

    it('should get payload by invoked lambda', done => {
      const fakePayload = {Payload: {foo: 'bar'}}
      const fakePayloadStringified = {Payload: JSON.stringify(fakePayload.Payload)}

      lambdaInvoker = new LambdaInvoker({
        invoke: (params, cb) => {
          cb(null, fakePayloadStringified)
        }
      })

      lambdaInvoker.invoke(functionNameStub, null, (err, data) => {
        expect(err).to.be.null
        expect(data).to.be.deep.equal(fakePayload.Payload)
        done()
      })
    })
  })

  describe('promise tests', () => {
    it('should invoke function return a promise', done => {
      expect(lambdaInvoker.invoke().constructor.name).to.equal('Promise')
      done()
    })

    it('should get error if lambdaInvoke is called without function name', () => {
      return lambdaInvoker.invoke('').catch(err => {
        expect(err).to.deep.equal(lambdaInvoker.errNoName)
      })
    })

    it('should get error by invoked lambda', () => {
      const fakeError = {statusCode: faker.random.number(), message: faker.lorem.word()}

      lambdaInvoker = new LambdaInvoker({
        invoke: (params, cb) => {
          cb(fakeError)
        }
      })

      return lambdaInvoker.invoke(functionNameStub).catch(err => {
        expect(err).to.be.deep.equal(fakeError)
      })
    })

    it('should get error if invoked lambda doesn\'t return a payload', () => {
      lambdaInvoker = new LambdaInvoker({
        invoke: (params, cb) => {
          cb(null, {})
        }
      })

      return lambdaInvoker.invoke(functionNameStub).catch(err => {
        expect(err).to.be.deep.equal(lambdaInvoker.errNoPayload)
      })
    })

    it('should get payload by invoked lambda', () => {
      const fakePayload = {Payload: {foo: 'bar'}}
      const fakePayloadStringified = {Payload: JSON.stringify(fakePayload.Payload)}

      lambdaInvoker = new LambdaInvoker({
        invoke: (params, cb) => {
          cb(null, fakePayloadStringified)
        }
      })

      return lambdaInvoker.invoke(functionNameStub).then((data) => {
        expect(data).to.be.deep.equal(fakePayload.Payload)
      })
    })
  })

})