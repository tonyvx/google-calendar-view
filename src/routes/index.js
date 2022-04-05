var express = require('express');
var router = express.Router();
var calendar = require('../services/gCalendar');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/:id/events', async function (req, res) {
  return res.send(await calendar.getEvents(req.params.id));
});

router.get('/:id/events/:from', async function (req, res) {
  return res.send(await calendar.getEvents(req.params.id, req.params.from));
});

router.get('/:id/events/:from/:to', async function (req, res) {
  return res.send(await calendar.getEvents(req.params.id, req.params.from, req.params.to));
});

module.exports = router;
