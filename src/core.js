let IMESSAGE = require('osa-imessage');
let fs = require('fs');
let {RTMClient, WebClient} = require('@slack/client');
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
module.exports = {ADMIN_TOKEN, MYID, BOTID, RTM, WEBADMIN, RTMADMIN, IMESSAGE};