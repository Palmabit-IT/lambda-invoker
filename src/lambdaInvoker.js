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
          const payload = this.parsePayload(data.Payload)

          if (this.hasError(payload)) {
            const error = this.fomatError(payload.errorMessage)
            cb(error)
            reject(error)

          } else {
            cb(null, payload)
            resolve(payload)
          }
        }

      })
    })
  }

  parsePayload(payload) {
    if (typeof payload === 'object') {
      return payload
    }
    
    try {
      return JSON.parse(payload)
    } catch (e) {
      return payload
    }
  }

  hasError(payload) {
    return payload && !!payload.errorMessage
  }

  fomatError(error) {
    error = this.parseError(error)

    if (typeof error === 'string') {
      return {
        statusCode: 400,
        message: error
      }
    }
    
    const err = typeof error === 'object' ? error : {}

    return {
      statusCode: err.statusCode || 400,
      message: err.message || 'Error',
    }
  }
  
  parseError(error) {
    try {
      return JSON.parse(error)
    } catch (e) {
      return error
    }
  }
}


module.exports = LambdaInvoker