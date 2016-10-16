var mysql = require("mysql");

//Create connection to RDS
var connection = mysql.createConnection({
  user:"Bento",
  password:"bentosan",
  host: "bentoboard.cpyw2xvgwji5.us-west-2.rds.amazonaws.com",
  database: "BentoBoard"
});

//Connect to DB
connection.connect(function(err){
  if(err){
    throw err;
  }
  else{
    console.log("DB connection")
  }
});

//Export connection
module.exports = connection;