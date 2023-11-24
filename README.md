The big News app - https://the-big-news-app.onrender.com/

This project is a news application which works similar to the popular Platform Reddit and provides users with the ability to create, search update and delete articles.

Some of the key features include:

- Searching existing articles by article id or filtering by topic
- A voting system to ‘score’ articles from users
- Posting comments

Instructions for use:

Please note this project is run with node js and PQSL

Your node.js version should be compatible with the current version used by express and PG. Node-postgres is compatible with node 8.x, 10.x, 12.x and 14.x To use node >= 14.x you will need to install pg@8.2.x

The project has been tested with the following:

Node js - 20.7.0
PG - ^8.7.3

To get started you can clone this repo - https://github.com/kevinzehner/news-app

Once cloned the next step is installing the project dependencies by running the command - npm install

To run and test the project you will need to create 2 .env files

.env test
.env development

This will enable you to run the project with test and development data.

Inside the each file, specify the database

.env.development
PGDATABASE=nc_news

.env.test
PGDATABASE=nc_news_test

Once you have completed this step you can run the following scripts:

Npm run setup-dbs
Npm run seed

This will connect and seed the database

If you would like to run tests for the projects you can run:

npm test

Happy Hacking!
