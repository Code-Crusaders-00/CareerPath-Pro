DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    userID SERIAL PRIMARY KEY,
    password CHAR(60) NOT NULL,
    firstName VARCHAR,
    lastNAME VARCHAR,
    email VARCHAR UNIQUE
);

DROP TABLE IF EXISTS applications CASCADE;
CREATE TABLE applications(
    appID SERIAL PRIMARY KEY,
    name VARCHAR,
    company VARCHAR,
    industry VARCHAR,
    description VARCHAR
);

DROP TABLE IF EXISTS user_to_applications CASCADE;
CREATE TABLE user_to_applications(
    userID INTEGER,
    appID INTEGER
);

DROP TABLE IF EXISTS jobs_to_user CASCADE;
CREATE TABLE jobs_to_user(
    jobID INTEGER ,
    userID INTEGER
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
    internship BOOLEAN DEFAULT FALSE,
    UNIQUE (application_link)
);
