var Sequelize = require("sequelize");
var connectionString = process.env.DATABASE_URL || 'postgres://admin:admin@localhost:5432/tablesurfer';
var db = new Sequelize(connectionString);

var User = db.define("User", {
  //here we will have to figure out the data from facebook on authentication
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  facebookId: Sequelize.BIGINT,
  token:      Sequelize.STRING,
  email:      Sequelize.STRING,
  profilePic: Sequelize.BLOB,
  gender:     Sequelize.STRING,
  job:        Sequelize.STRING
});

var Meal = db.define("Meal", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.STRING, // DATE
    allowNull: false
  },
  time: {
    type: Sequelize.STRING, //TIME
    allowNull: false
  },
  description: Sequelize.STRING,
  theme:       Sequelize.STRING,
  attendeeLimit: Sequelize.INTEGER
});

//create Users Users foreign key for meal
User.belongsToMany(Meal, {through: "UserAndMeal"});
Meal.belongsToMany(User, {through: "UserAndMeal"});

User.hasMany(Meal);
Meal.belongsTo(User, {as: "host"});

var Restaurant = db.define("Restaurant", {
  name:   {
            type: Sequelize.STRING,
            allowNull: false
          },
  address: Sequelize.ARRAY(Sequelize.STRING),
  contact: Sequelize.STRING,
  lat:     Sequelize.FLOAT,
  lng:     Sequelize.FLOAT,
  cuisine: Sequelize.STRING,
  image_url: Sequelize.STRING,
  url:     Sequelize.STRING
});

Restaurant.hasMany(Meal);
Meal.belongsTo(Restaurant);

var reset = function () {
  return db.sync({force:true});
};

db.sync();

exports.User       = User;
exports.Restaurant = Restaurant;
exports.Meal       = Meal;
exports.reset      = reset;
