const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  // res.send('Hey! It works!');
  // const micah = { name: 'Bob', age: 43, cool: true };
  // res.json(micah);
  // res.json(req.query);
  res.render('hello', {
    name: 'bob',
    dog: req.query.dog || "Fido",
    title: "I love food"
  });
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
