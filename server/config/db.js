var Sequelize = require("sequelize");
var connectionString = process.env.DATABASE_URL || 'postgres://admin:admin@localhost:5432/tablesurfer';
var db = new Sequelize(connectionString);

var User = db.define("User", {
  //here we will have to figure out the data from facebook on authentication
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  facebookId: {
    type: Sequelize.BIGINT,
    allowNull: true
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true
  },
  profilePic: {
    type: Sequelize.STRING,
    allowNull: true
  }
  
});

var Meal = db.define("Meal", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false
  },
  time: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
//create Users Users foreign key for meal
User.belongsToMany(Meal, {through: "UserAndMeal"});
Meal.belongsToMany(User, {as: "Attendee", through: "UserAndMeal"});

var Restaurant = db.define("Restaurant", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false
  },
  contact: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lat: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  lng: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  Genre: {
    type: Sequelize.STRING,
    allowNull: true
  }

});

Restaurant.hasMany(Meal);
Meal.belongsTo(Restaurant);

db.sync({force:true});

exports.Meal = Meal;
exports.User = User;
exports.Restaurant = Restaurant;
