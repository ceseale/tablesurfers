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
    type: Sequelize.BLOB, // BLOB turns into bytea for PostgreSQL. Can also specify BLOB('tiny') or medium or long
    allowNull: true
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: true
  },
  job: {
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
  },
  theme: {
    type: Sequelize.STRING,
    allowNull: true
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
  cuisine: {
    type: Sequelize.STRING,
    allowNull: true
  }

});

Restaurant.hasMany(Meal);
Meal.belongsTo(Restaurant);

User.sync({force:true})
.then(function(){
  return Meal.sync({force:true});
}).then(function(){
  return Restaurant.sync({force:true});
});



exports.Meal = Meal;
exports.User = User;
exports.Restaurant = Restaurant;
