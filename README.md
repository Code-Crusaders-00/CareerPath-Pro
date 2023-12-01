# CareerPath-Pro

CareerPath Pro is a job application tracker along with a job search engine that allows users to search for CS jobs. Users can also update their profile to include their skills and experience.

## Contributors

* @aflynn1002
* @charlottehauke
* @JosephDelisa
* @navanchauhan
* @rm004
* @Ryan-Mosier

## Tech Stack

- Node.js
- Express
- PostgreSQL
- EJS
- Bootstrap
- Docker / Docker Compose
- Swagger

## Pre-requisites

- Docker Compose
- Git

## Setup

```
git clone https://github.com/Code-Crusaders-00/CareerPath-Pro
cd CareerPath-Pro
git checkout stable # main branch tagged as stable (optional, but recommended)
cd "Project Code"
cp env.sample .env # if .env file does not exist already
docker compose up
```

## Usage

Open [http://localhost:3000](http://localhost:3000) in your browser.

Sample login credentials:

* user1@gmail.com : pass1
* user2@gmail.com : pass2
* user3@gmail.com : pass3
* user4@gmail.com : pass4
* user5@gmail.com : pass5

## API Documentation

API documentation is available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Configuration

To disable hot-reloading, edit `package.json` and replace `nodemon` with `node` in the `start` script.

## Running Tests

```
docker compose exec web npm test
```

## Deployed App

The app is deployed on Azure at [http://recitation-14-team-2.eastus.cloudapp.azure.com:3000/login](http://recitation-14-team-2.eastus.cloudapp.azure.com:3000/login).

Note: The deployed app is not guaranteed to be up-to-date with the latest changes.
