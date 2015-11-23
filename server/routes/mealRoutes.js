
module.exports = function(url, app, dbController) {

  app.route(url)
    .get(function( req, res){
      dbController.meals.get()
      .then(function(data) {
        res.status(200).send(data);
      })
      .catch(function(err) {
        res.status(500).send(err);
      });
    })
    .post(function(req, res) {
      //make an object of all the values that we need
      var meal = req.body;
      // //if the values are not valid then send err

      if (!meal.description) {
        res.sendStatus(400);
      }
      else{
      dbController.meals.post(meal)
      .then(function(data){
        res.sendStatus(201);
      })
      .catch(function(err){
        res.status(500).send(err); // update to sendStatus
      })
    }
    })
    .put(function(req, res) { // update and write test

      //user joining an event
      var join = req.body;

      dbController.user.joinMeal(join)
      .then(function(data) {
        res.status(200).send(data);
      })
      .catch(function(err) {
        res.status(500).send(err);
      });

  });
};
