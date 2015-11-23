module.exports = function( url, app, dbController) {
  app.route(url)
    .get(function(req, res) {
      var meal_id = req.params.id;
      dbController.meals.getOne(meal_id)
      .then(function(data) {
        res.status(200).send(data);
      })
      .catch(function(err) {
        res.status(404).send(err.message);
      });
    })
  }
