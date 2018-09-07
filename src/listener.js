const { ADMIN_TOKEN, MYID, BOTID, RTM, WEBADMIN, RTMADMIN, IMESSAGE } = require("./core.js")
const low = require('lowdb')
const path = require("path")
const FileSync = require('lowdb/adapters/FileSync')
const dbPath = path.join(__dirname, '..', 'db.json')
// console.log(dbPath)
const adapter = new FileSync(dbPath)
const db = low(adapter)

var instance;

// Set some defaults (required if your JSON file is empty)
db.defaults({
    conversations: [{
        // uuid: "random",
        imsg_handle: "yo",
        slack_channel: "yo"
    }]
}).write()

// var request = require('request');


// WEBADMIN.groups.list()
//   .then((res) => {
//     // `res` contains information about the channels
//     // console.log(res)
//     res.groups.forEach(c => {
//         // console.log(c.id)
//         let chan =  c.id
//         console.log(ADMIN_TOKEN)
//         console.log(chan)
//         // WEBADMIN.groups.unarchive({channel: chan})
//         WEBADMIN.groups.leave({channel: chan})
//         // WEBADMIN.conversations.close({channel: chan})
//         // {ADMIN_TOKEN, chan}
//     });
//   })
//   .catch(console.error);

var self;

class Bridge {
    constructor() {
        this.RTM = RTM;
        this.RTMADMIN = RTMADMIN;
        this.WEBADMIN = WEBADMIN;
        this.IMESSAGE = IMESSAGE;
        self = this
    }

    lookUpChannel(handle) {    
        return new Promise(function(resolve, reject) {
            resolve(db.get('conversations').find({ imsg_handle: handle }).value())
        })
    }

    lookUpHandle(channel) {    
        return new Promise(function(resolve, reject) {
            resolve(db.get('conversations').find({ slack_channel: channel }).value())
        })
    }

    addChannelLookup(handle, channel) {
        return db.get('conversations').push({
            imsg_handle: handle,
            slack_channel: channel
        }).write()
    }

    addNewSlackChannel(name) {
        return this.WEBADMIN.groups.create({ ADMIN_TOKEN, name })
    }

    upsertSlackInfo(handle) {
        return new Promise(function(resolve, reject) {
            self.addNewSlackChannel(handle).then(function(res) {
                // console.log(res)
                let channel = res.group.id
                self.addChannelLookup(handle, channel)
                self.WEBADMIN.groups.invite({    
                    channel: channel,
                    user: BOTID
                })
                resolve(channel)
            })
        })
    }

    fetchChannel(handle) {
        // console.log("Fetch Channel")
        return new Promise(function(resolve, reject) {
            self.lookUpChannel(handle).then(function(channel) {
                // console.log(channel)
                if (channel === undefined) {
                    // console.log("Need to upsert")
                    self.upsertSlackInfo(handle).then(function(channel) {
                        // console.log(channel)
                        // self.lookUpChannel(handle).then(function(channel) {
                        resolve(channel)
                        // })
                    })

                } else {
                    resolve(channel.slack_channel)
                }

            })
        })
    }

    fetchHandle(channel) {
        // console.log("Fetch Handle")
        return new Promise(function(resolve, reject) {
            self.lookUpHandle(channel).then(function(handle) {
                // console.log(channel)
                if (channel === undefined) {
                    console.log("Need to upsert")
                    self.upsertSlackInfo(channel).then(function(handle) {
                        console.log(handle)
                        // self.lookUpChannel(handle).then(function(channel) {
                        resolve(handle)
                        // })
                    })

                } else {
                    resolve(handle.imsg_handle)
                }

            })
        })
    }

    fromMe(sender) {
        if (sender == MYID) {
            return true
        }
        return false
    }

    sendToSlackAsMe(body, channel) {
        this.RTMADMIN.sendMessage(body, channel)
            .then((res) => {
                // console.log(res)
                console.log("   ", "body: ", body)
                console.log("   ", "->", channel)
            })
            .catch(console.error);
    }

    sendToSlackAsThem(body, channel) {
        this.RTM.sendMessage(body, channel)
            .then((res) => {
                // console.log(res)
                console.log("   ", "body: ", body)
                console.log("   ", "->", channel)
            })
            .catch(console.error);
    }

    sendToiMessageAsMe(to, body) {
        this.IMESSAGE.send('drbh@protonmail.com', body)
        // this.IMESSAGE.send('+' + , "unn")
        console.log("   ", "body: ", body)
        console.log("   ", "->", to)
    }

    oniMessage(message) {
        let { guid, text, handle, group, fromMe, date, dateRead } = message
        let messageFromMe = fromMe
        this.fetchChannel(handle).then(function(result) {
            let channel = result
            console.log("")
            console.log("iMessage -> bridge -> slack")
            console.log("   ", handle, "->")

            if (messageFromMe) {   // send to slack one time
                self.sendToSlackAsMe(text, channel)  
            }  
            else {    
                self.sendToSlackAsThem(text, channel)  
            }
        })
    }

    onSlackMessage(message) {
        let { type, user, text, client_msg_id, team, channel, event_ts, ts } = message
        // console.log(message)
        let messageFromMe = this.fromMe(user)
        // channel = this.fetchChannel(user)
        // console.log(channel)
        if (messageFromMe) {   // send to slack one time
            this.sent = true
            // console.log("SENDING DONT REPEAT")
            // console.log(channel)
            this.fetchHandle(channel).then(function(result) {
                let handle = result
                console.log("")
                console.log("slack -> bridge -> iMessage")
                console.log("   ", channel, "->")
                self.sendToiMessageAsMe(handle, text)  
            })

        }
    }

    start() {
        this.RTM.on('message', (event) => {
            // console.log(event)
            this.onSlackMessage(event)
        });
        this.IMESSAGE.listen().on('message', (event) => {
            // console.log(event)
            // console.log("SAW MESSAGE")
            if (this.sent) {
                // console.log("IT IS FROM ME")
                this.sent = false
            } else {
                this.oniMessage(event)
            }

        })
        console.log(" - - - - - - - - started - - - - - - - - ")
    }

    stop() {
        process.exit(0);
    }


}

instance = new Bridge()


module.exports = { instance };