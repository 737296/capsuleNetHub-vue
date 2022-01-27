'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  /**
   * 项目前台项目访问地址
   */
  UI_BASE_URL: '"/"',
  /**
   * 项目后台地址
   */
  API_BASE_URL: '"./api"',
  /**
   * 开启SSO登录模式
   */
  SSO_LOGIN: 'false'
})
