const imessage = require('osa-imessage')
const fs = require('fs');
const { RTMClient, WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - usually xoxb)
const token = 'xoxb-BOT_TOKEN' // bot_token
const admin_token = 'xoxp-SLACK_TOKEN' //process.env.SLACK_TOKEN;

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
rtm.start();

const web = new WebClient(admin_token);
var convos;
fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {

        obj = JSON.parse(data); //now it an object
        // console.log(obj)
        convos = obj
    }
})

// can find in browser
const bot_id = "SLACK_BOT_CHANNEL"

//////////////////////////////////////////////////////////////

function doWork(text, data) {
    console.log(text + " " + data);
}

function callback(resp) {
    console.log("added")
}

function addNewSlackChannel(name) {
    // return web.groups.create({ token, name })
    return web.groups.create({ admin_token, name })
}

String.prototype.hashCode = function() {
    str = this.replace(/([^a-z0-9áéíóúñü_-\s\.,]|[\t\n\f\r\v\0])/gim, "");
    return str.trim();
};

function addChannelLookup(handle, channel) {
    return new Promise(function(resolve) {
        fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data); //now it an object

                key = handle.hashCode()
                obj[key] = channel
                json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
            }
        })
    })
}

function lookUpChannel(handle) {
    return new Promise(function(resolve) {
        fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data); //now it an object
                res = obj[handle.hashCode()]
                resolve(res);
            }
        })
    });
}

function getSlackInformation(hand) {
    return new Promise(function(resolve) {
        lookUpChannel(hand).then(function(channel) {
            // console.log(res)
            if (typeof channel != 'undefined') {
                console.log("Found in file")
                // console.log(hand)
                // console.log(res)
                resolve(channel);
            } else {
                console.log("Add to file")
                addNewSlackChannel(hand).then((res) => {
                    // console.log(hand)
                    // console.log(res.group.id)


                    addChannelLookup(hand, res.group.id)

                    web.groups.invite({ channel: res.group.id, user: bot_id }).then(null)
                    // web.groups.invite(res.group.id, bot_id)

                    setTimeout(function(args) {
                        resolve(hand)
                    }, 100)
                    r
                })
            }


        })
    })
}

function sendMessage(prefix, msg) {

    hand = msg.handle
    text = msg.text

    console.log(hand + "  " + text)

    getSlackInformation(hand).then(function(conversationId) {
        console.log(text)
        console.log(conversationId)

        rtm.sendMessage(prefix + " " + text, conversationId)
            .then((res) => {
                // console.log(res)
                // `res` contains information about the posted message
                console.log('Message sent: ', res.ts);
            })
            .catch(console.error);
    })
}

function sendAdminiMessage(prefix, msg) {

    hand = msg.handle
    text = msg.text

    console.log(hand + "  " + text)

    getSlackInformation(hand).then(function(conversationId) {

        console.log(text)
        console.log(conversationId)

        rtm_admin.sendMessage(prefix + " " + text, conversationId)
            .then((res) => {
                // console.log(res)
                // `res` contains information about the posted message
                console.log('Message sent: ', res.ts);
            })
            .catch(console.error);
    })
}

function val2key(val, array) {
    for (var key in array) {
        if (array[key] == val) {
            return key;
        }
    }
    return false;
}

// The client is initialized and then started to get an active connection to the platform
const rtm_admin = new RTMClient(admin_token);
rtm_admin.start();


console.log("STARTING APPLICATION")
rtm.on('message', (event) => {

    console.log(event.channel)
    // console.log(convos)
    console.log(val2key(event.channel, convos))

    console.log(event.text)
    contact_key = val2key(event.channel, convos)


    if (!message.subtype && message.user === rtm.activeUserId) {
        console.log("")
        console.log(rtm.activeUserId)
        return
    }
    if (event.text != undefined) {
        imessage.send('+' + contact_key, event.text)
    }

});

imessage.listen().on('message', (msg) => {

    if (!msg.fromMe) {
        sendMessage("", msg)
    } else {
        // sendAdminiMessage("", msg)
    }

})