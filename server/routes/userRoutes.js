module.exports = function (url, app, dbController) {
  app.route(url)
  .get(function (req, res) {
    dbController.user.testGet()
    .then(function(data) {
      res.status(200).send(data);
    })
    .catch(function(err) {
      console.log('err getting user data:', err);
      res.status(500).send(err);
    });
  })
  .post(function (req, res) {
    if (!req.body.name) {
      res.sendStatus(400);
    } else {
      dbController.user.post(req.body)
      .then(function(data) {
        res.sendStatus(201);
      })
      .catch(function(err) {
        res.status(500).send(err); // update to sendStatus
      });
    }
  });
};
