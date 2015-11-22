module.exports = function( url, app, dbController) {
  app.route(url)
    .get(function(req, res) {
      var meal_id = req.params.id;
      console.log('Serverside, retrieve this meal: ', req.params);
      dbController.meals.getOne(meal_id)
      .then(function(data) {
        res.status(200).send(data);
      })
      .catch(function(err) {
        console.log('Error getting meals/:id from router: ', err);
        res.status(404).send(err.message);
      });
    })
  }
