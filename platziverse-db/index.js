'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')

module.exports = async function (config) {
  const sequelize = setupDatabase(config)
  const agentModel = setupAgentModel(config)
  const metricModel = setupMetricModel(config)

  agentModel.hasMany(metricModel)
  metricModel.belongsTo(agentModel)

  await sequelize.authenticate()

  if(config.setup){
      await sequelize.sync({force:true});
  }

  const agent = {}
  const metric = {}
  return {
    agent,
    metric
  }
}
