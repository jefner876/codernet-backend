# CoderNET API

## Background

A REST API for a discussion board deisgned for coders, including real-time messaging and connection for a Mongodb cloud database. Developed as a group project during Northcoders Bootcamp.

A version of this api is hosted [here](https://codernet.up.railway.app/api/users).

Information about a connecting front end may be found [here](https://github.com/Guy0017/Guy0017-coderNet-FE) with an associated hosted version [here](https://codernet.onrender.com/)

## Setup Process

If you want to develop this project you will first need to:

1. Fork a copy to your GitHub account
2. Clone the repo to your local machine
   ```
   git clone urlForYourFork
   ```
3. Install dependencies

   ```
   npm install
   ```

4. Set up .env files
   To use your clone you will need to create two .env files.

   - .env.test
   - .env.development

   Into each add DATABASE_URL="mongodb connection string", with the correct connection string for your own mongodb database.

5. The test system will seed test databases for you, just run:
   ```
   npm run test:e2e
   ```
6. You can now start the app locally (note: use ctrl+c to kill the server):
   ```
   npm run dev:start
   ```
8. All done! You can now make requests to your server with a programmes such as [Insomnia](https://insomnia.rest/) or look at connecting to a front end as we have done [here](https://github.com/Guy0017/Guy0017-coderNet-FE)

## Structure

### Built using:

- [Nest.js](https://nestjs.com/)
  - [Node.js](https://nodejs.org/en/about/)
  - [Express.js](https://expressjs.com/)
  - [Jest](https://jestjs.io/) for TDD
- [socket.io](https://socket.io/)
- [Mongodb](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)


### Minimum Requirements

- Node.js v18.2.0
- Nest.js v9.1.1
- Mongodb

## Enjoy!