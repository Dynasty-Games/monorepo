import Client from './src/client.js'
import Server from './src/server.js'
import test from 'tape'


test('test storage write/read/delete', async tape => {
    tape.plan(2)
    await new Server()
    const client = await new Client()

    const timestamp = new Date().getTime()

    await client.put(`/currencies/${timestamp}/bitcoin`, Buffer.from(JSON.stringify({test: 1})))
    let data = await client.get(`/currencies/${timestamp}/bitcoin`)
    tape.ok(data.length > 0, 'can write/read')

    await client.delete(`/currencies/${timestamp}/bitcoin`)
    const has = await client.has(`/currencies/${timestamp}/bitcoin`)

    tape.ok(!has, 'can delete')
    
    return
})