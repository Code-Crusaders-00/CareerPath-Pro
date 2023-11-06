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
    jobID SERIAL PRIMARY KEY,
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
