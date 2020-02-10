const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  if (req.session.visitCount) {
    req.session.visitCount++;
  } else {
    req.session.visitCount = 1;
  }
  res.render('index', {
    title: 'App created with Ironhack generator.',
    visitCount: req.session.visitCount,
    sess: JSON.stringify(req.session)
  });
});

router.get('/secret', routeGard, (req, res) => res.render('/users/secret'));

module.exports = router;