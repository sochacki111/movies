## Description

API for getting and adding Movies to/from json file database

## Note

At first, I tried utilizing nodejs streams (as seen in git history) to keep the application more performant as streams don't put the whole files into the memory at once. But due to project requirements such as getting a random movie or sorting I change the implementation to using fs.readFile.

## Installation

```bash
$ npm install
```

## Running the app

1. Create a database json file (you can use db-example.json)
2. Create .env from .env.example
3. Inside .env specify the path to the database json file (DB_JSON_PATH)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Documentaion

Docs available at: http://localhost:3000/docs

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Future improvements

- Introduce Redis for request caching in order to keep the app more performant