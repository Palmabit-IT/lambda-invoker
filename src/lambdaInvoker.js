'use strict'

class LambdaInvoker {

  constructor(Lambda) {
    this.Lambda = Lambda

    this.errNoName = {statusCode: 400, message: 'No function name'}
    this.errNoPayload = {statusCode: 400, message: 'Can\'t get payload'}
  }

  invoke(name, payload, callback) {
    return new Promise((resolve, reject) => {
      const cb = typeof callback === 'function' ? callback : new Function()

      if (!name) {
        cb(this.errNoName)
        return reject(this.errNoName)
      }

      const params = {
        FunctionName: name,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(payload)
      }

      this.Lambda.invoke(params, (err, data) => {
        if (err) {
          cb(err)
          reject(err)

        } else if (!data || !data.Payload) {
          cb(this.errNoPayload)
          reject(this.errNoPayload)

        } else {
          cb(null, data.Payload)
          resolve(data.Payload)
        }

      })
    })
  }
}


module.exports = LambdaInvoker