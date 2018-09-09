const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json());
var path = require('path');
const { instance } = require('./src/listener.js')

app.get('/', (req, res) => {
    res.sendFile('/public/index.html');
})

app.get('/try-start', (req, res) => {
    instance.tryStart()
    res.send({
        status: instance.isRunning,
    })
})

app.get('/db', (req, res) => {})

app.get('/start', (req, res) => {
    instance.start()
    res.send({ status: instance.isRunning })
})
app.get('/stop', (req, res) => {

    instance.stop()
    res.send({ status: instance.isRunning })
})

app.get('/status', (req, res) => {
    // hacky way to wait for call to complete 
    (async() => {
        try {
            let result = await instance.IMESSAGE.getRecentChats(1)
            if (result.length == 0) {
                res.send({ status: "fail" })
                return
            }
            res.send({
                status: instance.isRunning,
                slack: {
                    status: instance.RTM.connected,
                },
                imessage: {
                    status: true,
                }
            })
        } catch (e) {
            res.send({ status: "fail" })
            console.log(e)
        }
    })();
})

app.post('/config', (req, res) => {
    // console.log(req.body)
    for (let key of Object.keys(req.body)) {
        // console.log(key, "->", req.body[key])
        instance.updateVaildCredential(key, req.body[key])
    }
    instance.checkCredentials().then(function(result) {
        res.send(result)
    })
})

app.get('/config', (req, res) => {
    instance.checkCredentials().then(function(result) {
        // console.log(result)
        res.send(result)
    })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))