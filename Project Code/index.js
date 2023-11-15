const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.render('pages/register', {error: req.session.error});
});

app.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = `INSERT INTO users (password, firstName, lastName, email)
                   VALUES ($1, $2, $3, $4)`
    try {
        await db.none(query, [hash, req.body.firstNAME, req.body.lastNAME, req.body.email]);
        console.log(`Registered user ${req.body.firstNAME}`);
        req.session.error = {
            err_level: "success",
            err_msg: "You have successfully registered. Please login."
        }
        res.redirect('/login');
    } catch (error) {
        console.log(`Failed to register user: ${error}`);
        req.session.error = {
            err_level: "danger",
            err_msg: "Failed to register user. Please try again. Error: " + error.message || error
        }
        res.redirect('/register');
    }
})

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Request a list of jobs with optional filtering
 *     description: Retrieve a list of jobs with the ability to filter by various criteria.
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Optional company name to filter jobs.
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Optional role to filter jobs.
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Optional location to filter jobs.
 *       - in: query
 *         name: offers_sponsorship
 *         schema:
 *           type: boolean
 *         description: Optional filter for jobs offering sponsorship (true or false).
 *       - in: query
 *         name: requires_us_citizenship
 *         schema:
 *           type: boolean
 *         description: Optional filter for jobs requiring U.S. citizenship (true or false).
 *       - in: query
 *         name: internship
 *         schema:
 *           type: boolean
 *         description: Optional filter for internships (true or false).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Optional limit on the number of results returned (max 1000).
 *       - in: query
 *         name: random
 *         schema:
 *           type: boolean
 *         description: Optional flag to return results in random order.
 *     responses:
 *       200:
 *         description: List of jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   company:
 *                     type: string
 *                     description: Company name of the job.
 *                   role:
 *                     type: string
 *                     description: Role of the job.
 *                   location:
 *                     type: string
 *                     description: Location of the job.
 *                   offers_sponsorship:
 *                     type: boolean
 *                     description: Indicates if the job offers sponsorship.
 *                   requires_us_citizenship:
 *                     type: boolean
 *                     description: Indicates if the job requires U.S. citizenship.
 *                   internship:
 *                     type: boolean
 *                     description: Indicates if the job is an internship.
 *         examples:
 *           application/json:
 *             [
 *               {
 *                 "company": "ExampleCorp",
 *                 "role": "Software Engineer",
 *                 "location": "New York",
 *                 "offers_sponsorship": true,
 *                 "requires_us_citizenship": false,
 *                 "internship": false
 *               }
 *             ]
 */
app.get('/api/jobs', async (req, res) => {
    let count = 5;
    try {
        const { company, role, location, offers_sponsorship, requires_us_citizenship, internship, limit, random} = req.query;
        let query = 'SELECT * FROM jobs';
        const conditions = [];
        const parameters = [];

        // Add conditions for filtering
        if (company) {
            conditions.push('company = $' + (conditions.length + 1));
            parameters.push(company);
        }
        if (role) {
            conditions.push('role = $' + (conditions.length + 1));
            parameters.push(role);
        }
        if (location) {
            conditions.push('location = $' + (conditions.length + 1));
            parameters.push(location);
        }
        if (offers_sponsorship != null) {
            conditions.push('offers_sponsorship = $' + (conditions.length + 1));
            parameters.push(offers_sponsorship === 'true');
        }
        if (requires_us_citizenship != null) {
            conditions.push('requires_us_citizenship = $' + (conditions.length + 1));
            parameters.push(requires_us_citizenship === 'true');
        }
        if (internship != null) {
            conditions.push('internship = $' + (conditions.length + 1));
            parameters.push(internship === 'true');
        }

        // Combine the conditions using 'AND'
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Add limit
        if (limit != null) {
            count = parseInt(limit);
            // make sure count is a number and less than 1000
            if (isNaN(count) || count > 1000) {
                count = 20;
            }
        }

        // Add random
        if (random != null) {
            query += ' ORDER BY RANDOM()';
        }


        query += ` LIMIT ${count}`;
        const jobs = await db.any(query, parameters);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users/:userId/job-applications', (req, res) => {
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

app.get('/api/users/:userId/job-applications/:applicationId', (req, res) => {
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

app.get('/login', (req, res) => {
    res.render('pages/login', {user: req.session.user, error: req.session.error});
    if (typeof req.session.error !== 'undefined') {
        console.log("Error:", req.session.error, "Type:", typeof req.session.error);
        req.session.error = undefined;
        req.session.save();
    }
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
                        userid: data.userid,
                        firstName: data.firstname,
                        lastName: data.lastname,
                        email: data.email,
                        password: data.password
                    };
                    req.session.user = user;
                    req.session.save();
                    res.redirect('/home');
                } else {
                    console.log("Invalid Password");
                    req.session.error = {
                        err_level: "danger",
                        err_msg: "Invalid Email or Password. To Register, click the Register button."
                    }
                    res.redirect("/login");
                }
            } else {
                console.log("User not found");
                req.session.error = {
                    err_level: "danger",
                    err_msg: "Invalid Email or Password. To Register, click the Register button."
                }
                res.redirect("/login");
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

// Authentication Middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
        req.session.error = {
            err_level: "danger",
            err_msg: "You must be logged in to view this page."
        }
        return res.redirect('/login');
    }
    next();
};

// Authentication Required
app.use(auth);

app.get('/home', async (req, res) => {
    // Get Random Jobs
    try { 
        const jobs = await fetch("http://localhost:3000/api/jobs?limit=15&random=true").then((res) =>
        res.json()
    );
    res.render('pages/home', {user: req.session.user, error: req.session.error, jobs });
    } catch (error) {
        console.log(error);
        res.render('pages/home', {user: req.session.user, error: req.session.error, jobs: [] });
    }
});

  app.get('/logout', (req, res) => {
      req.session.destroy();
      res.redirect('/login');
  });

app.get('/jobs', async (req, res) => {
  try {
    //const jobs = await db.any('SELECT * FROM jobs LIMIT 50 ');
    // Make request to API
    const jobs = await fetch("http://localhost:3000/api/jobs?limit=50").then((res) =>
        res.json()
    );
    //res.render("pages/jobBoard", { jobs});
    res.render("pages/jobBoard", {jobs, user: req.session.user, error: req.session.error});
  } catch (error) {
    console.error(error);
    res.render("pages/jobBoard", {
      jobs: [],
      error: true,
      message: error.message,
    });
  }
});

app.get('/api/users/:userId/job-applications', (req, res) => {
    const queryOne = `SELECT appID
                      FROM user_to_applications
                      WHERE userID = '${req.params.userId}'`;

    db.task(t => {
        return t.any(queryOne)
            .then(appIds => {
                const appIdsArr = appIds.map((app) => {
                    return app.appid;
                });
                if (appIdsArr.length == 0) {
                    return [];
                }
                const queryTwo = `SELECT *
                                  FROM applications
                                  WHERE appID = ANY (array [${appIdsArr}])`;
                return t.any(queryTwo);
            });
    })
        .then((appArr) => {
            res.render('pages/applications', {apps: appArr});
        })
        .catch((err) => {
            console.log(err);
        });
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
   app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });
 }

 module.exports = app;
