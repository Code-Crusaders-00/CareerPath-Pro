# CareerPath-Pro

## Setup

```
git checkout stable # main branch tagged as stable
cd "Project Code"
cp env.sample .env # if .env file does not exist already
docker compose up
```

## API Documentation

API documentation is available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Configuration

To disable hot-reloading, edit `package.json` and replace `nodemon` with `node` in the `start` script.
