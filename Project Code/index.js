const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords

// TO DO: Connect to database stuff
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};
const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     saveUninitialized: false,
//     resave: false,
//   })
// );

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// TO DO: API endpoints
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', (req, res) => {

});

app.get('/users/:userId/job-applications', (req, res) => {
  const queryOne = `SELECT jobID FROM jobs_to_user WHERE username = '${req.params.userId}'`;

  db.any(queryOne)
    .then( (jobId) => {
      const jobIds = jobId.map( (job) => {
        return job.jobid;
      });

      const queryTwo = `SELECT * FROM applications WHERE jobID = ANY (array[${jobIds}])`;

      db.any(queryTwo)
        .then( (jobs) => {
          res.send(jobs);
        })
        .catch( (err) => {
          console.log(err);
        });

    })
    .catch( (err) => {
      console.log(err);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
