var express = require('express');
var path = require('path');
var router = express.Router();
var calendar = require('../services/gCalendar');

var cors = require('cors');
/* GET home page. */
router.get(['/calendar/*', '/users', '/about'], function (req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/index.html'));
});


router.get('/:id/events', cors(), async function (req, res) {
  return res.send(await calendar.getEvents(req.params.id));
});

router.get('/:id/events/:from', cors(), async function (req, res) {
  return res.send(await calendar.getEvents(req.params.id, req.params.from));
});

router.get('/:id/events/:from/:to', cors(), async function (req, res) {
  return res.send(await calendar.getEvents(req.params.id, req.params.from, req.params.to));
});

module.exports = router;
