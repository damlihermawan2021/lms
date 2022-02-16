const PSON = require('pson')
const uid = ['775FC2F0-9891-47AC-8E81-C815358300B4']
const pson = new PSON.ProgressivePair(uid)
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const pub = require('fs').readFileSync('keys/idm.pub')

const s = {
  ser: function (d) {
    return pson.encode(d).toString('hex').toUpperCase()
  },
  dser: function (d) {
    return pson.decode(Buffer.from(d, 'hex'))
  },
  cSer: function (c) {
    const cp = cookie.parse(c[0])
    const d = jwt.decode(cp.access_token)
    return s.ser({
      t: cp.access_token,
      o: d.oid,
      u: d.sub
    })
  },
  cDSer: function (c) {
    try {
      const d = s.dser(c)
      jwt.verify(d.t, pub, {
        subject: d.s,
        issuer: 'cakti-aa',
        algorithms: ['RS512']
        // TODO: check token expiration and notBefore date
      })
      return {
        valid: true,
        user: d.u
      }
    } catch (err) {
      return {
        valid: false,
        err: err
      }
    }
  }
}

module.exports = s
