# The Tech Blog

Welcome to the CMS-Style Blog Site project! This web application is designed for developers to publish their blog posts and engage in discussions by commenting on other developers' posts. The site is built from scratch, following the MVC paradigm in its architectural structure. Key technologies utilized include Handlebars.js as the templating language, Sequelize as the ORM (Object-Relational Mapping), and the express-session npm package for authentication. The application is deployed on Heroku for seamless access.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Credits](#credits)
- [License](#license)

## Features

1. **User Authentication:**
   - Secure user authentication powered by express-session.
   - Users can create accounts, log in, and log out.

2. **Blog Post Management:**
   - Create, edit, and delete blog posts.
   - View and comment on posts created by other developers.

3. **MVC Architecture:**
   - Follows the Model-View-Controller paradigm for a clean and organized codebase.
   - Handlebars.js is used for templating, providing a dynamic and efficient front-end.

4. **Database Integration:**
   - Sequelize is employed as the ORM for interacting with the database.
   - Database models include User, BlogPost, and Comment.

5. **Deployment:**
   - The application is deployed on Heroku for easy access and use.

## Installation 

You can view and use the app via the deployed heroku link. 

[The Tech Blog](https://the-tech-blog-927-bcf6bdd4bce2.herokuapp.com/)

## Usage

![Image 1](./assets/Screenshot%202024-01-25%20at%206.27.57 PM.png)
![Image 2](./assets/Screenshot%202024-01-25%20at%206.28.04 PM.png)
![Image 3](./assets/Screenshot%202024-01-25%20at%206.28.37 PM.png)
![Image 4](./assets/Screenshot%202024-01-25%20at%206.28.44 PM.png)
![Image 5](./assets/Screenshot%202024-01-25%20at%206.28.54 PM.png)

## Dependencies 

- express
- express-session
- express-handlebars
- sequelize
- mysql2
- bcrypt

For a complete list of dependencies, please refer to the package.json files in the root, client, and server folders.

## Credits

[Sequelize Documentation](https://sequelize.org/docs/v6/getting-started/)

[Handlebars.js Documentation](https://handlebarsjs.com/guide/)

[MySQL2 Documentation](https://sidorares.github.io/node-mysql2/docs/documentation)

## License 

See GitHub repository.