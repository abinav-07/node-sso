# READ ME

## INTRODUCTION

This Readme file will help you in configuring the application and help in understanding the folder structure.

## CONFIGURATION

This section covers the process for configuring and installing the application packages.

1. Install `Node.js` in your system.
2. In your terminal, run `npm init -y` && `npm i` to install all the packages.
3. Install `Eslint` and `Prettier` in your VS Code editor.
4. Use `DBeaver` or `MySQL Workbench` for easy database usage.
5. Add `.env` to your root folder and add all the env contents by communicating with team members.
6. In your terminal, run `git flow --init`. [CheatSheet](https://danielkummer.github.io/git-flow-cheatsheet/)
7. Use CommonJS (CJS) modules instead of EcmaScript Modules (ESM) because of the synchronous nature of CJS.
8. Use `Sequelize` for migrations and `JOI` for validations.
9. Follow AirBnb Style Guide. [AirBnb](https://github.com/airbnb/javascript)

## Operating Instructions

This section covers the folder structures and the contents that you will find inside each folder.

### Files and Folders

1. #### node_modules
   - Default folder created by `npm i`.
2. #### controllers
   - This folder contains sub folders that have business logic codes.
   - The sub-folder name should be respective to the business logic inside it.
   - The sub-folder may have multiple files related to similar business logics.
   - The files inside the sub-folder should not contain huge chunks of code, use separate file inside the sub-folder in such case.
   - In the index.js file of the main controllers folder, export all the functions from sub-folders to minimize imports in other folder.
3. #### queries
   - This folder contains files which has the required Queries for the business logics.
   - The file name should be respective to the queries inside it.
   - Use Sequelize to run queries. Use raw query only when required.
   - In the index.js file of the main queries folder, export all the classes from files to minimize imports in other folder.
4. #### routes
   - This folder contains files which has APIs for business logics.
   - This folder may contain multiple files to distinguish APIs.
5. #### database
   - This folder contains sub-folders to distinguish databases.
   - Each sub-folders have sub-sub-folder auto generated by `npx sequelize-cli init`
   - Migrations are generated inside the migrations sub-sub-folder.
   - Create Table Models inside models sub-sub-folder.
   - More information on Sequelize Migrations. [Sequelization](https://sequelize.org/master/manual/migrations.html)
6. #### enums
   - This folder contains files that define `CONSTANTS`.
7. #### exceptions
   - This folder contains files that help in handeling Exceptions in the application. For Example: HttpsExceptions.
   - The exceptions defined in these files are thrown through out the application using `TRY CATCH BLOCKS`.
8. #### helpers
   - This folder contains sub-folder and files that have reusable functions.
9. #### middlewares
   - This folder contains middlewares for the application such as error handling middleware and user authentication middleware.
10. #### .env
    - Add all the environment variables inside this file.
11. #### .eslintrc.js
    - Config eslint.
    - Modify eslint rules.
12. #### .prettierrc
    - Config prettier
    - Modify prettier rules.
13. #### .sequelize Files
    - These files are used to config sequelizations.
    - These files names are used during migrations and generation of tables.
14. #### index.js
    - Handles app startup.
    - Handles routes.
    - Handles Global Variables.
    - Handles Middlewares.
15. #### Use 'npm run doc' to generate jsdoc.