// const { ADMIN_TOKEN, MYID, BOTID, RTM, WEBADMIN, RTMADMIN, IMESSAGE } = require("./core.js")
let IMESSAGE = require('osa-imessage');
let fs = require('fs');
let { RTMClient, WebClient } = require('@slack/client');
let config = require('./config.js')

// An access token (from your Slack app or custom integration - usually xoxb)
const token = config.BOT_TOKEN // bot_token
const ADMIN_TOKEN = config.SLACK_TOKEN //process.env.SLACK_TOKEN;
const MYID = config.MYID
// The client is initialized and then started to get an active connection to the platform
const RTM = new RTMClient(token);
const WEBADMIN = new WebClient(ADMIN_TOKEN);
const RTMADMIN = new RTMClient(ADMIN_TOKEN);

// can find in browser
const BOTID = config.BOT_CHANNEL


// Start Slack Watcher
RTM.start();
RTMADMIN.start();


console.log("loaded core.js")
// module.exports = {
ADMIN_TOKEN, MYID, BOTID, RTM, WEBADMIN, RTMADMIN, IMESSAGE
// };



const low = require('lowdb')
const path = require("path")
const FileSync = require('lowdb/adapters/FileSync')
// const dbPath = path.join(__dirname, '..', 'db.json')
const dbPath = path.join('db.json')

console.log(dbPath)
// console.log(dbPath)
const adapter = new FileSync(dbPath)
const db = low(adapter)

var instance;

// Set some defaults (required if your JSON file is empty)
db.defaults({
    conversations: [],
    credentials: []
}).write()

var self;

class Bridge {
    constructor() {
        self = this
        this.tryStart()
    }

    tryStart() {
        this.checkCredentials().then(function(credentials) {
            self.checkCredentialValidity(credentials).then(function(claims) {
                if (claims) {
                    console.log("valid credentials and ready to start")
                    self.ready()
                } else {
                    console.log("non-valid credentials and not ready to start")
                }
            })
        })
    }

    checkCredentialValidity(credentials) {
        return new Promise(function(resolve, reject) {
            var i = 0
            for (let key of ["BOT_TOKEN", "SLACK_TOKEN", "BOT_CHANNEL", "MYID"]) {
                let res = db.get('credentials').find({ key: key }).value()
                if (res != undefined){
                    i += 1
                }
                
                console.log(res)
            }
            console.log(i)
            if (i < 4) {
                console.log("didnt include all needed config")
            }
            return resolve(false)
        })
    }

    ready() {
        this.isRunning = false;
        this.RTM = RTM;
        this.RTMADMIN = RTMADMIN;
        this.WEBADMIN = WEBADMIN;
        this.IMESSAGE = IMESSAGE;
        this.RTM.on('message', (event) => {
            if (!this.isRunning) {
                console.log("not running")
                return
            }
            console.log(event)
            this.onSlackMessage(event)
        });
        this.IMESSAGE.listen().on('message', (event) => {
            if (!this.isRunning) {
                console.log("not running")
                return
            }
            if (this.sent) {
                this.sent = false
            } else {
                this.oniMessage(event)
            }
        })
        console.log(" - - - - - - - - started - - - - - - - - ")
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
                setTimeout(function(args) {
                    resolve(channel)
                }, 1000)

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
                        console.log("UPSERTING")
                        console.log(handle)
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
        this.IMESSAGE.send(to, body)
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
            console.log(channel)
            if (messageFromMe) {   // send to slack one time
                self.sendToSlackAsMe(text, channel)  
                self.sentFromPhone = true
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
        console.log(channel)
        if (self.sentFromPhone) {
            console.log("skip since i sent")
            self.sentFromPhone = false
            return
        }
        if (messageFromMe) {   // send to slack one time
            this.sent = true
            // console.log("SENDING DONT REPEAT")
            // console.log(channel)
            this.fetchHandle(channel).then(function(result) {
                let handle = result
                if (handle == undefined) {
                    console.log("THIS FAILED TO RETURN A VAILD iMessage HANDLE")
                    return
                }
                console.log("")
                console.log("slack -> bridge -> iMessage")
                console.log("   ", channel, "->")
                self.sendToiMessageAsMe(handle, text)  
            })
        }
    }

    checkCredentials() {
        return new Promise(function(resolve, reject) {
            resolve(db.get('credentials').value())
        })
    }

    updateCredentialsAttribute(key, value) {
        let results = db.get('credentials').find({ key: key })
        if (results.value() == undefined) {
            console.log("add")
            db.get('credentials').push({ key: key, value: value }).write()
        } else {
            console.log("update")
            db.get('credentials').find({ key: key }).assign({ value: value }).write();
        }
    }

    updateVaildCredential(key, value) {
        if (!["BOT_TOKEN", "SLACK_TOKEN", "BOT_CHANNEL", "MYID"].includes(key)) {
            console.log("not valid attribute")
            return
        }
        this.updateCredentialsAttribute(key, value)
    }

    start() {
        this.isRunning = true
        console.log(this.isRunning)
    }

    stop() {
        this.isRunning = false
        console.log(this.isRunning)
    }
}
instance = new Bridge()

module.exports = { instance };