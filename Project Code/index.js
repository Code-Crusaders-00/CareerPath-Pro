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

//initialize session variables
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

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

app.post('/login', async (req, res) => {

    const email = req.body.email;
    const query = "select * from users where email = $1";
    const values = [email];

    if (email != null) {
        try {
            const data = await db.oneOrNone(query, values); // Use oneOrNone instead of one
            if (data) {
                console.log("User data:", data);
                const match = await bcrypt.compare(req.body.password, data.password);
                if (match) {
                    console.log("Password is correct");
                    const user = {
                        firstNAME: data.firstNAME,
                        lastNAME: data.lastNAME,
                        email: data.email,
                        password: data.password
                    };
                    req.session.user = user;
                    req.session.save();
                    res.redirect('/home');
                } else {
                    console.log("Invalid Password");
                    res.redirect("/login");
                }
            } else {
                console.log("User not found");
                res.redirect("/register");
            }
        } catch (err) {
            console.error("Error during login:", err);
            res.redirect("/login");
        }
    } else {
        console.log("No Username Provided.");
        res.redirect("/login");
    }
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = `INSERT INTO users (password, firstName, lastName, email)
                   VALUES ($1, $2, $3, $4)`
    try {
        await db.none(query, [hash, req.body.firstNAME, req.body.lastNAME, req.body.email]);
        console.log(`Registered user ${req.body.firstNAME}`)
        res.redirect('/login');
    } catch (error) {
        console.log(`Failed to register user: ${error}`);
        res.redirect('/register');
    }
})

app.get('/users/:userId/job-applications', (req, res) => {
    const queryOne = `SELECT jobID
                      FROM jobs_to_user
                      WHERE username = '${req.params.userId}'`;

    db.task(t => {
        return t.any(queryOne)
            .then(jobId => {
                const jobIds = jobId.map((job) => {
                    return job.jobid;
                });
                const queryTwo = `SELECT *
                                  FROM applications
                                  WHERE jobID = ANY (array [${jobIds}])`;
                return t.any(queryTwo);
            });
    })
        .then((jobs) => {
            res.send(jobs);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/users/:userId/job-applications', (req, res) => {
    const queryOne = `INSERT INTO applications
                          (name, company, industry, description)
                      VALUES ('${req.body.name}', '${req.body.company}', '${req.body.industry}',
                              '${req.body.description}')
                      RETURNING jobID`;

    db.one(queryOne)
        .then((jobId) => {
            const queryTwo = `INSERT INTO jobs_to_user (jobID, username)
                              VALUES (${jobId}, '${req.params.userId}')`;

            db.none(queryTwo)
                .then(() => {
                    res.status(200);
                    res.redirect(`/users/${req.params.userId}/job-applications`);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/users/:userId/job-applications/:applicationId', (req, res) => {
    const query = `SELECT *
                   FROM applications
                   WHERE jobID = '${req.params.applicationId}'`;

    db.one(query)
        .then((job) => {
            res.send(job);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/jobs', (req, res) => {
  const query = `SELECT * FROM applications WHERE jobID = '${req.params.applicationId}'`;
});

app.get('/jobs', async (req, res) => {
  try {
    const jobs = await db.any('SELECT * FROM jobs LIMIT 50 ');
    res.render("pages/jobBoard", { jobs });
  } catch (error) {
    console.error(error);
    res.render("pages/jobBoard", {
      jobs: [],
      error: true,
      message: error.message,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

