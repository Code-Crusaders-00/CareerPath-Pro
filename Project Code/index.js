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


app.get('/information', (req, res) => {
    res.render('pages/informations', {user: req.session.user, error: req.session.error});
});

app.post('/information', async (req, res) => {
    const query = `INSERT INTO personal_info (first_name, last_name, phone_number, email, street_address, city, state, zip_code, college, degree, high_school, company_name, position, employment_time, achievements, skills, referal_name, referal_email, referal_number, resume, user_id_1)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, ARRAY[$12, $13, $14, $15], ARRAY[$16, $17, $18, $19], ARRAY[$20, $21, $22, $23], ARRAY[$24, $25, $26, $27], $28, ARRAY[$29, $30], ARRAY[$31, $32], ARRAY[$33, $34], $35, $36)`;
    const query_1 = 'select * from personal_info';
    try {
        await db.none(query, [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email_1, req.body.street_address, req.body.city, req.body.state, req.body.zip_code, req.body.college, req.body.degree, req.body.high_school, req.body.company_name, req.body.company_name_2, req.body.company_name_3, req.body.company_name_4, req.body.position, req.body.position_2, req.body.position_3, req.body.position_4, req.body.employment_time, req.body.employment_time_2, req.body.employment_time_3, req.body.employment_time_4, req.body.achievements, req.body.achievements_2, req.body.achievements_3, req.body.achievements_4, req.body.skills, req.body.referal_name, req.body.referal_name_2, req.body.referal_email, req.body.referal_email_2, req.body.referal_number, req.body.referal_number_2, req.body.resume, req.session.user.userid])
            req.session.user.formData = req.body;
            req.session.save();
            console.log(`Information enterted successfully ${req.body.first_name}`);
            req.session.error = {
                err_level: "success",
                err_msg: "You have successfully inputed your information."
            }
            res.redirect('/information_1');
    } catch (error) {
        console.log(`Failed to submit information: ${error}`);
        req.session.error = {
            err_level: "danger",
            err_msg: "Failed to submit information. Please try again. Error: " + error.message || error
        }
        res.redirect('/information');
    }
})

app.get('/information_1', (req, res) => {
    res.render('pages/information_1', {user: req.session.user, error: req.session.error});
});

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Request a list of jobs with optional filtering
 *     description: Retrieve a list of jobs with the ability to filter by various criteria.
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: full_text
 *         schema:
 *          type: string
 *         description: Optional full text search.
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
        const { ft_search, company, role, location, offers_sponsorship, requires_us_citizenship, internship, limit, random} = req.query;
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
        if (ft_search) {
            // use like to search for a substring in both company and role test all lowercase
            conditions.push('LOWER(company) LIKE LOWER($' + (conditions.length + 1) + ') OR LOWER(role) LIKE LOWER($' + (conditions.length + 1) + ')');
            parameters.push('%' + ft_search + '%');
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
                    const query_2 = `SELECT * FROM personal_info WHERE user_id_1 = (SELECT userID FROM users WHERE userID = ${data.userid});`;
                    const data_2 = await db.oneOrNone(query_2);
                    const user = {
                        userid: data.userid,
                        firstName: data.firstname,
                        lastName: data.lastname,
                        email: data.email,
                        password: data.password,
                        formData: data_2
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

app.get('/api/users/:userId/job-applications', (req, res) => {
    const queryOne = `SELECT EXISTS(SELECT * FROM users WHERE userID = ${req.params.userId})`;
    const queryTwo = `SELECT appID FROM user_to_applications WHERE userID = ${req.params.userId}`;

    db.one(queryOne)
        .then( (user) => {
            if (!user.exists)
                throw new Error('User not found');

            return db.any(queryTwo);
        })
        .then( (appIdsObj) => {
            const appIdsArr = appIdsObj.map( (app) => {
                return app.appid;
            });

            if (appIdsArr.length === 0)
                return [];

            const queryThree = `SELECT * FROM applications WHERE appID = ANY(array [${appIdsArr}])`;
            return db.any(queryThree);
        })
        .then( (apps) => {
            res.status(200).json(apps);
        })
        .catch( (err) => {
            res.status(500).json({error: err.message});
        });
});

app.post('/api/users/:userId/job-applications', (req, res) => {
    const queryOne = `SELECT EXISTS(SELECT * FROM users WHERE userID = ${req.params.userId})`;

    db.one(queryOne)
        .then( (user) => {
            if (!user.exists)
                throw new Error('User not found');
            else if (!req.body.name || !req.body.company || !req.body.industry || !req.body.description)
                throw new Error('Incorrect request body format');

            const queryTwo = `INSERT INTO applications (name, company, industry, description)
                                VALUES ('${req.body.name}', '${req.body.company}', '${req.body.industry}', '${req.body.description}')
                                RETURNING appID`;

            return db.one(queryTwo);
        })
        .then( (appID) => {
            const queryThree = `INSERT INTO user_to_applications (userID, appID)
                                    VALUES (${req.params.userId}, ${appID.appid})
                                    RETURNING appID`;
            return db.one(queryThree);
        })
        .then( (appID) => {
            res.status(201).json(appID);
        })
        .catch( (err) => {
            res.status(500).json({error: err.message});
        });
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
    res.render('pages/home', {user: req.session.user, error: req.session.error, jobs});
    } catch (error) {
        console.log(error);
        res.render('pages/home', {user: req.session.user, error: req.session.error, jobs: []});
    }
});

  app.get('/logout', (req, res) => {
      req.session.destroy();
      res.redirect('/login');
  });

app.get('/jobs', async (req, res) => {
  try {
    // Check if there is a query parameter for full text search
    const ft_search = req.query.ft_search;
    if (ft_search === undefined) {
        jobs = await fetch("http://localhost:3000/api/jobs?limit=50").then((res) =>
            res.json()
        );
        res.render("pages/jobBoard", {jobs, user: req.session.user, error: req.session.error});
    } else {
        jobs = await fetch(`http://localhost:3000/api/jobs?ft_search=${ft_search}&limit=50`).then((res) =>
            res.json()
        );
        res.render("pages/jobBoard", {jobs, user: req.session.user, error: req.session.error});
    }
    //res.render("pages/jobBoard", { jobs});
    
  } catch (error) {
    console.error(error);
    res.render("pages/jobBoard", {
      jobs: [],
      error: true,
      message: error.message,
    });
  }
});

app.get('/job-applications', async (req, res) => {
    try {
        // Make request to API
        const jobApps = await fetch(`http://localhost:3000/api/users/${req.session.user.userid}/job-applications`).then((res) =>
            res.json()
        );
        //res.render("pages/jobBoard", { jobs});
        res.render("pages/applications", {apps: jobApps, user: req.session.user, error: req.session.error});
      } catch (error) {
        console.error(error);
        res.render("pages/home", {
          jobs: [],
          error: true,
          message: error.message,
        });
      }
});

app.get('/job-applications/edit/:applicationid', (req, res) => {
    const query = "SELECT * FROM applications WHERE appID = $1";

    db.one(query, [req.params.applicationid])
        .then((app) => {
            res.render('pages/update-application', {user: req.session.user, app: app});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/job-applications/edit', (req, res) => {
    const query = 'UPDATE applications SET name = $1, company = $2, industry = $3, description = $4 WHERE appID = $5';

    db.none(query, [req.body.name, req.body.company, req.body.industry, req.body.description, req.body.applicationid])
        .then( () => {
            res.redirect('/job-applications');
        })
        .catch( (err) => {
            console.log(err);
        });
});

app.get('/job-applications/add', (req, res) => {
    res.render('pages/add-application', {user: req.session.user});
});

app.post('/job-applications/add', (req, res) => {
    const queryOne = "INSERT INTO applications (name, company, industry, description) VALUES ($1, $2, $3, $4) RETURNING appID";

    db.one(queryOne, [req.body.name, req.body.company, req.body.industry, req.body.description])
        .then( (appid) => {
            const queryTwo = "INSERT INTO user_to_applications (userID, appID) VALUES ($1, $2)";
            return db.none(queryTwo, [req.session.user.userid, appid.appid]);
        })
        .then( () => {
            res.redirect('/job-applications');
        })
        .catch( (err) => {
            console.log(err);
        });
});

app.post('/job-applications/delete', (req, res) => {
    const queryOne = 'DELETE FROM applications WHERE appID = $1';
    const queryTwo = 'DELETE FROM user_to_applications WHERE appID = $1 AND userID = $2';

    db.none(queryOne, [req.body.applicationid])
        .then( () => {
            return db.none(queryTwo, [req.body.applicationid, req.session.user.userid]);
        })
        .then( () => {
            res.redirect('/job-applications');
        })
        .catch( (err) => {
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