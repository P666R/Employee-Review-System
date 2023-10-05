# Employee-Review-System

The Employee Review System is a web application that provides a user-friendly interface for managing employee information, performance reviews, and feedback. It allows administrators to efficiently track employee performance and facilitate the review process

## Features

- Signup/Signin for users
- Admin can designate employees to provide reviews, update and delete employees
- Employees can view their pending, given and received reviews
- Employee can provide their reviews to the designated co-employees once assigned to do so by admin

## Folder structure

- 📂 **Employee\-Review\-System**
  - 📂 **config**
    - 📄 [flashMiddleware.js](config/flashMiddleware.js)
    - 📄 [passportLocal.js](config/passportLocal.js)
  - 📂 **controllers**
    - 📄 [adminController.js](controllers/adminController.js)
    - 📄 [authController.js](controllers/authController.js)
    - 📄 [employeeController.js](controllers/employeeController.js)
  - 📂 **models**
    - 📄 [reviewModel.js](models/reviewModel.js)
    - 📄 [userModel.js](models/userModel.js)
  - 📂 **public**
    - 📂 **css**
      - 📄 [style.css](public/css/style.css)
    - 📂 **img**
  - 📂 **routes**
    - 📄 [adminRoutes.js](routes/adminRoutes.js)
    - 📄 [authRoutes.js](routes/authRoutes.js)
    - 📄 [employeeRoutes.js](routes/employeeRoutes.js)
    - 📄 [index.js](routes/index.js)
  - 📂 **views**
    - 📂 **partials**
      - 📄 [\_footer.ejs](views/partials/_footer.ejs)
      - 📄 [\_header.ejs](views/partials/_header.ejs)
    - 📄 [adminDashboard.ejs](views/adminDashboard.ejs)
    - 📄 [assignReviewPage.ejs](views/assignReviewPage.ejs)
    - 📄 [employeeDashboard.ejs](views/employeeDashboard.ejs)
    - 📄 [feedbackFormPage.ejs](views/feedbackFormPage.ejs)
    - 📄 [homePage.ejs](views/homePage.ejs)
    - 📄 [layout.ejs](views/layout.ejs)
    - 📄 [signinPage.ejs](views/signinPage.ejs)
    - 📄 [signupPage.ejs](views/signupPage.ejs)
  - 📄 [.eslintrc.json](.eslintrc.json)
  - 📄 [.gitignore](.gitignore)
  - 📄 [.prettierrc](.prettierrc)
  - 📄 [app.js](app.js)
  - 📄 [package\-lock.json](package-lock.json)
  - 📄 [package.json](package.json)
  - 📄 [readme.md](readme.md)
  - 📄 [server.js](server.js)

## Installation And Usage

1. Git clone https://github.com/P666R/Employee-Review-System.git
2. Npm install to install all the dependencies
3. Create config.env file in the root of project and add following data

- PORT=[Your Port]
- DATABASE=[Your DB url]
- DATABASE_PASSWORD=[Your DB password]

4. Start the application: npm start

Application will be accessible at http://localhost:3000
