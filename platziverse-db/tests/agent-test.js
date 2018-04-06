'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixture = require('./fixtures/agent')

let config = {
  logging: function () {}
}

let agentSingle = Object.assign({}, agentFixture.single)
let id = 1
let metricStub = {
  belongsTo: sinon.spy()
}

let agentStub = null
let db = null
let sandbox = null

test.beforeEach(async () => {
  sandbox = sinon.sandbox.create()
  agentStub = {
    hasMany: sandbox.spy()
  }

  agentStub.findById = sandbox.stub();
  agentStub.findById.withArgs(id).returns(Promise.resolve(agentFixture.byId(id)));

  const setupDatabase = proxyquire('../', {
    './models/agent': () => agentStub,
    './models/metric': () => metricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.sandbox.restore()
})

test('Agent', t => {
  t.truthy(db.agent, 'Agent service should exist')
})

test.serial('Setup', t => {
  t.true(agentStub.hasMany.called, 'agentModel.hasMany has execute')
  t.true(agentStub.hasMany.calledWith(metricStub), 'Arguments should be the MetricModel')
  t.true(metricStub.belongsTo.called, 'metricModel.belongTo has execute')
  t.true(metricStub.belongsTo.calledWith(agentStub), 'Arguments should be the AgentModel')
})

test.serial('Agent-FindById', async t => {
  let agent = await db.agent.findById(id)

  t.deepEqual(agent, agentFixture.byId(id), 'should be the same')
})
