'use strict'

const Sequelize = require('sequelize')
let instance = null

module.exports = function setupDatabase (config) {
  if (!instance) {
    instance = new Sequelize(config)
  }
  return instance
}
