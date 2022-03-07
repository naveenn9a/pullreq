const express = require('express')
const app = express()
var fs = require('fs');
const cors = require('cors');
let { usrPermission } = require('./config/permission')
const port = 9090

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/json', (req, res) => {
  fs.readFile('config/config.json', 'utf8', function (err, data) {
    if (err) throw err;
    let obj = JSON.parse(data);
    let newObj = {};

    Object.keys(obj).map(menuKey => {
      if (obj[menuKey].display) {
        newObj[menuKey] = {}
        newObj[menuKey].id = obj[menuKey].id
        newObj[menuKey].display = obj[menuKey].display
        newObj[menuKey]['site-level'] = obj[menuKey]['site-level'] ? obj[menuKey]['site-level'].filter(o => o.display) : []
        newObj[menuKey]['track-level'] = obj[menuKey]['track-level'] ? obj[menuKey]['track-level'].filter(o => o.display) : []
        newObj[menuKey]['non-editable'] = obj[menuKey]['non-editable'] ? obj[menuKey]['non-editable'].filter(o => o.display) : []
      }
    })

    res.json({ items: newObj, usrPermission })
  });
})

app.post('/json', (req, res) => {
  let body = req.body;

  fs.readFile('config/config.json', 'utf8', function (err, data) {
    if (err) throw err;
    let obj = JSON.parse(data);
    let newObj = { ...obj };
    newObj[body.menu] = body;

    fs.writeFileSync('config/config.json', JSON.stringify(newObj));
    res.json({ status: 'done' })
  });
})

app.get('/geofence', (req, res) => {
  fs.readFile('config/geofence.json', 'utf8', function (err, data) {
    if (err) throw err;
    res.json(data)
  });
})

app.get('/lightpanel', (req, res) => {
  fs.readFile('config/lightpanel.json', 'utf8', function (err, data) {
    if (err) throw err;
    res.json(data)
  });
})

app.post('/updateLight', (req, res) => {
  let body = req.body;

  fs.readFile('config/lightpanel.json', 'utf8', function (err, data) {
    if (err) throw err;
    let obj = JSON.parse(data);
    let newObj = {};

    let temp = { ...obj }
    console.log(temp)

    temp['items'][body.lightKey].selected = body.color

    fs.writeFileSync('config/lightpanel.json', JSON.stringify(temp));
    res.json(temp)
  });
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})