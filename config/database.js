const mongoose = require('mongoose');

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 

const conn = process.env.MONGO_URI;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean
});

const homeSchema = new mongoose.Schema({
    title: {
      type: String
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
  }
  });

const standingSchema = new mongoose.Schema({
    information: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
}
});




const User = connection.model('User', UserSchema);
const Home = connection.model('Home', homeSchema)
const StudentProjects = connection.model('Projects', projectSchema)
const Standings = connection.model('Standings', standingSchema)


// Expose the connection
module.exports = connection;
