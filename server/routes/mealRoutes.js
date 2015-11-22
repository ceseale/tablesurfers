var classes = require('../classes/classes');

module.exports = function(url, app, dbController) {

  app.route(url)
    .get(function( req, res){
      console.log('routing to db');
      dbController.meals.get()
      .then(function(data) {
        res.status(200).send(data);
      })
      .catch(function(err) {
        console.log('err posting meal data', err);
        res.status(500).send(err);
      });
    })
    .post(function(req, res) {
      //make an object of all the values that we need
      var meal = classes.Meal(req.body);
      // //if the values are not valid then send err

      if (!meal) {
        res.status(400).send('wrong data passed to routes');
      }
      //else go onto the queries
      dbController.meals.post(meal)
      .then(function(data){
        res.status(201).send(data);
      });
    })
    .put(function(req, res) {

      //user joining an event
      var join = new classes.Join(req.body);

      dbController.user.joinMeal(join)
      .then(function(data) {
        res.status(200).send(data);
      })
      .catch(function(err) {
        console.log('err posting meal data:', err);
        res.status(500).send(err);
      });

  });
};
