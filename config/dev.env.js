var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //API_ROOT:'"http://localhost:8088/ebrain/api"'
  API_ROOT:'"http://47.94.101.171:8095/api/v1"'
})
