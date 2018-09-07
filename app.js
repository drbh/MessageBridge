const express = require('express')
const app = express()
var path = require('path');
const {instance} = require('./src/listener.js')
// const worker = require('./src/worker.js')


// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')

// const adapter = new FileSync('db.json')
// const db = low(adapter)

// // Set some defaults (required if your JSON file is empty)
// db.defaults({ posts: [], user: {}, count: 0 })
//   .write()

// // Add a post
// db.get('posts')
//   .push({ id: 1, title: 'lowdb is awesome'})
//   .write()

// // Set a user using Lodash shorthand syntax
// db.set('user.name', 'typicode')
//   .write()
  
// // Increment count
// db.update('count', n => n + 1)
//   .write()

instance.start()

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + '/public/index.html'));
// })


// app.get('/db', (req, res) => {
// // res.send(db.get('posts')
// //   .find({ id: 1 })
// //   .value())

// })

// app.get('/start', (req, res) => {
// 	instance.start()
//     res.send('Started Listener')
// })
// app.get('/stop', (req, res) => {
// 	res.send('Kill program')
//     instance.stop()
// })

// app.get('/status', (req, res) => {
//     res.send('Hello World!')
// })

// app.get('/config', (req, res) => {
//     res.send('Hello World!')
// })

// app.listen(3000, () => console.log('Example app listening on port 3000!'))