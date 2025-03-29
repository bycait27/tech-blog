# The Tech Blog

A CMS-Style tech blog site for developers that follows the MVC paradigm.

<img src="./assets/home.png" width="500" alt="Homepage">

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Live Demo](#live-demo)
- [Challenges and Solutions](#challenges-and-solutions)
- [Future Improvements](#future-improvements)
- [Learning Outcomes](#learning-outcomes)
- [License](#license)
- [Contact](#contact)

## Overview

The Tech Blog is a CMS-style blog site that allows developers to publish articles, blog posts, and share their thoughts on tech concepts. Built with the MVC paradigm using Handlebars.js, MySQL, Express.js, and Node.js, this platform enables users to create an account, write posts, edit their content, and interact with other developers through comments.

This project addresses the need for developers to have a dedicated space to publish their insights and learn from others in a community-focused environment. It demonstrates my ability to create full-stack applications with user authentication and database management.

## Features

<!-- add screenshots to show features in use -->

- **User Authentication:**  Secure login and registration powered by express-session.  

<img src="./assets/login-singup2.png" width="500" alt="Login and Signup">    

- **Blog Post Management:** Ability to create, edit, and delete blog posts.    

<img src="./assets/new-post.png" width="500" alt="Create New Post"> . 

<img src="./assets/edit-post.png" width="500" alt="Edit Post">

- **User Dashboard:** Users can access and manage their blog posts on their own dashboard.  

<img src="./assets/dashboard.png" width="500" alt="User Dashboard">

- **User Interaction:** Ability to comment on other user's posts.     

<img src="./assets/blogpost-signedin.png" width="500" alt="Comments">

## Technologies

### Frontend
- **Markup & Structure:** HTML5
- **Templating Engine:** Handlebars.js
- **Styling:** CSS3
### Backend
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Authentication:** Bcrypt, express-session
- **Database:** JawsDB with MySQL
- **ORM:** Sequelize  
<!-- JavaScript   -->
### DevOps
- **CI/CD:** GitHub Actions (coming soon)
- **Hosting:** Heroku
### Testing (coming soon)

## Installation 

### Prerequisites
<!-- add prerequisites here -->
- Node.js (v14+)
- MySQL
- Git
- npm

### Setup Instructions
```bash
# clone the repo (ssh)
git clone git@github.com:bycait27/tech-blog.git

# navigate to project directory
cd the-tech-blog

# install dependencies
npm install

# set up .env file in root of project 
# add environment variables
DB_NAME='blog_db'
DB_USER='your_mysql_username'
DB_PASSWORD='your_mysql_password'
SESSION_SECRET='your_session_secret'

# seed the data 
npm run seed

# start the development server
npm start

# navigate to server (localhost:3001)
```

## Usage

<!-- step-by-step guide on how to use the app with code examples where appropriate -->

After installing and running the application, you can:
1. **Register an account** with a username and password
2. **Create and add blog posts** through your dashboard page
3. **Edit and delete blog posts** using the dashboard tools available
4. **Comment on other user's posts** via the homepage by clicking on their blog post

### Example API usage
```javascript
// add example here
```

## API Documentation
The API follows RESTful principles: 

| Endpoint             | Method | Description         | Authentication Required |
|:---------------------|:-------|:--------------------|:------------------------|
| `/api/users`         | GET    | Get all users       | No                      |
| `/api/users/:id`     | GET    | Get user by ID      | No                      |
| `/api/users`         | POST   | Create a new user   | No                      |
| `/api/users/login`   | POST   | User login          | No                      |
| `/api/users/logout`  | POST   | User logout         | Yes                     |
| `/api/blogposts`     | GET    | Get all blog posts  | No                      |
| `/api/blogposts/:id` | GET    | Get blog post by ID | No                      |
| `/api/blogposts`     | POST   | Create a blog post  | Yes                     |
| `/api/blogposts/:id` | PUT    | Update a blog post  | Yes                     |
| `/api/blogposts/:id` | DELETE | Delete a blog post  | Yes                     |
| `/api/comments`      | GET    | Get all comments    | No                      |
| `/api/comments`      | POST   | Create a comment    | Yes                     |
| `/api/comments/:id`  | DELETE | Delete a comment    | Yes                     |

## Project Structure

```
the-tech-blog/
|
|-- assets/                    # app images for README 
|-- config/                    # connection config 
|-- controllers/               # basic CRUD operations
   |-- api/
|-- db/                        # database schema
|-- models/                    # database models
|-- public/ 
   |-- css                     # styles for frontend
   |-- js                      # backend functions
|-- seeds/                     # JSON data and seed functions
|-- utils/                     # extra helper functions
|-- views/                     # handlebars.js
|-- server.js                  # entry point
```

## Live Demo

Check out the live application: [The Tech Blog](https://the-tech-blog7-f8ee982770ad.herokuapp.com/)

## Challenges and Solutions

<!-- description of a technical challenge faced and how it was solved and what was learned -->

- **Challenge: Session Management in Heroku**
  - **Solution:** Implemented proper session storage with Sequelize and configured cookies for secure deployment. Added `trust proxy` setting and adjusted cookie parameters to work in production environment.

- **Challenge: Password Hashing and Security**
  - **Solution:** Utilized bcrypt.js for secure password hashing with salt rounds to ensure user credentials are properly protected, preventing potential security vulnerabilities.

- **Challenge: Comment System Implementation**
  - **Solution:** Created a many-to-many relationship between users, posts, and comments using Sequelize associations, enabling proper data retrieval and display while maintaining data integrity.

## Future Improvements

<!-- Functionality I want to add: -->
- Tags for different tech topics 
- Reply to other user's comments
- Like other user's comments
- Link to a user's posts
- The ability to bookmark your favorite posts

## Learning Outcomes

<!-- go into more detail with these -->

- **MVC Architecture:** Implemented proper separation of concerns using the Model-View-Controller pattern, making the codebase more organized and maintainable.

- **Templating Engines:** First time using Handlebars.js as a frontend templating engine, providing valuable experience with server-side rendering before moving to client-side frameworks like React.

- **User Authentication:** Built a complete authentication system with session management, password hashing, and protected routes.

- **Database Relations:** Created complex relationships between users, posts, and comments using Sequelize ORM, demonstrating understanding of relational database design.

- **Heroku Deployment:** Successfully deployed a full-stack application with database connections to Heroku, managing environment variables and database migrations.

- **Data Seeding:** Utilized JSON for initial data population, which streamlined testing and development processes.

- **RESTful API Design:** Developed a comprehensive API following RESTful principles for data operations.

## License 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  

see LICENSE file for more details

## Contact

**GitHub:** [@bycait27](https://github.com/bycait27)  
**Portfolio Website:** [caitlinash.io](https://caitlinash.io/)  
**LinkedIn:** [Caitlin Ash](https://www.linkedin.com/in/caitlin-ash/)  

---
*This project was originally created as part of my Full-Stack Developer Bootcamp program.*
