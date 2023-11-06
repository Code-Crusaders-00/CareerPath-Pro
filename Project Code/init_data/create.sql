DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
  username VARCHAR(50) PRIMARY KEY,
  password CHAR(60) NOT NULL,
  firstName VARCHAR,
  lastNAME VARCHAR,
  email VARCHAR
);

DROP TABLE IF EXISTS applications CASCADE;
CREATE TABLE applications(
    jobID INTEGER PRIMARY KEY,
    name VARCHAR,
    company VARCHAR,
    industry VARCHAR,
    description VARCHAR
);

DROP TABLE IF EXISTS jobs_to_user CASCADE;
CREATE TABLE jobs_to_user(
    jobID INTEGER ,
    username VARCHAR(50)
);

DROP TABLE IF EXISTS jobs CASCADE;
CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    company VARCHAR,
    date_posted DATE,
    role VARCHAR,
    location VARCHAR,
    application_link VARCHAR,
    offers_sponsorship BOOLEAN DEFAULT TRUE,
    requires_us_citizenship BOOLEAN DEFAULT TRUE,
    internship BOOLEAN DEFAULT FALSE
);
