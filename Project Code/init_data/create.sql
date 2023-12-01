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
    description VARCHAR,
    status VARCHAR
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


DROP TABLE IF EXISTS personal_info CASCADE;
CREATE TABLE personal_info(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR,
    phone_number VARCHAR,
    email VARCHAR UNIQUE,
    street_address VARCHAR,
    city VARCHAR,
    state VARCHAR,
    zip_code VARCHAR,
    college VARCHAR,
    degree VARCHAR,
    high_school VARCHAR,
    company_name VARCHAR[],
    position VARCHAR[],
    employment_time VARCHAR[],
    achievements VARCHAR[],
    skills VARCHAR,
    referal_name VARCHAR[],
    referal_email VARCHAR[],
    referal_number VARCHAR[],
    resume BYTEA,
    user_id_1 INT REFERENCES users(userID)
);
