const TestModelFactory = require('../../../lib/TestModelFactory')

const FF_UTIL = require('flowforge-test-utils')
const { Roles } = FF_UTIL.require('forge/lib/roles')

module.exports = async function (config = {}) {
    const forge = await FF_UTIL.setupApp(config)
    const factory = new TestModelFactory(forge)

    await forge.db.models.PlatformSettings.upsert({ key: 'setup:initialised', value: true })
    const userAlice = await forge.db.models.User.create({ admin: true, username: 'alice', name: 'Alice Skywalker', email: 'alice@example.com', email_verified: true, password: 'aaPassword' })
    const userBob = await forge.db.models.User.create({ username: 'bob', name: 'Bob Solo', email: 'bob@example.com', email_verified: true, password: 'bbPassword' })

    const defaultTeamType = await forge.db.models.TeamType.findOne({ where: { id: 1 } })
    const team1 = await forge.db.models.Team.create({ name: 'ATeam', TeamTypeId: defaultTeamType.id })
    await team1.addUser(userAlice, { through: { role: Roles.Owner } })
    await team1.addUser(userBob, { through: { role: Roles.Member } })

    const template = await factory.createProjectTemplate({
        name: 'template1',
        settings: {
            httpAdminRoot: '',
            codeEditor: '',
            palette: {
                npmrc: 'example npmrc',
                catalogue: ['https://example.com/catalog'],
                modules: [
                    { name: 'node-red-dashboard', version: '3.0.0' },
                    { name: 'node-red-contrib-ping', version: '0.3.0' }
                ]
            },
            emailAlerts: {
                crash: true,
                safe: true,
                recipients: 'owners'
            }
        },
        policy: {
            httpAdminRoot: true,
            dashboardUI: true,
            codeEditor: true
        }
    }, userAlice)

    const projectType = await factory.createProjectType({
        name: 'projectType1',
        description: 'default project type',
        properties: { foo: 'bar' }
    })

    const stack = await factory.createStack({ name: 'stack1' }, projectType)

    const application = await factory.createApplication({ name: 'application-1' }, team1)

    const instance = await factory.createInstance(
        { name: 'project1' },
        application,
        stack,
        template,
        projectType,
        { start: false }
    )

    forge.TestObjects = {
        defaultTeamType,
        userAlice,
        userBob,
        team1,
        application,
        instance
    }
    forge.factory = factory
    return forge
}
