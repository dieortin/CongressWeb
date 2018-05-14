# CongressWeb
CongressWeb is a web application running on NodeJS with the purpose of showcasing the 2018 Spanish-Portuguese Relativity Encounter and handling registrations.

It consists of a homepage, some informative pages, and a registration system. There's also an authentication system for administrators.

## Administration
All administration pages are hidden at first. Logging in as an administrator makes additional options available in the navigation bar and in normal pages such as the participant list.

### Logging in as an administrator
You can log in as an administrator (previously owning an admin account) via the /login path. Sessions are persisted for a week by default, but you can sign out at any time.

### Administrator registration
Administrators can be registered via the /userRegistration path.
The registration page for administrators should be closed once the application hits production. Otherwise, anyone who discovers the path would be able to create an administrator account and access restricted funcionality.

# Running the server

### Installing the dependencies
Run `$ yarn install` inside the project folder in order to install the required packages for running the server

### Starting the server
Run `$ yarn start`. If you want to see detailed logs, you should set the `DEBUG` environment variable to `congressweb:*` or just run `$ DEBUG=congressweb:* yarn start`

### Server configuration
The server requires *all* of the following variables to be correctly defined in the environment (or in a .env file in the project root) in order to run properly:

* SESSION_SECRET (random string)
* DATABASE_HOST (IP of the mongodb server)
* DATABASE_USER (username to be used in the mongodb server)
* DATABASE_PASSWORD (password for the user in the mongodb server)
* DATABASE_PORT (port of the mongodb server)
* DATABASE_PATH (path for the database in the mongodb server)
* RECAPTCHA_SECRET (your secret string obtained from [Google Recaptcha](https://www.google.com/recaptcha/admin))
* REGISTRATION_OPENING (with the following format: 'December 17, 1995 03:24:00')
* NODE_ENV (if not set, Node will use 'development')
* APP_MOUNT_DIR (directory of the server in which the server should listen for requests)
* MAIL_SERVICE (one of those defined [here](http://nodemailer.com/smtp/well-known/))
* MAIL_USER (username for the mail server)
* MAIL_PASSWORD (password for the mail server)
* MAIL_DESTINATARIES (comma + space separated list of destination addresses for registration mails)

If one or more of these variables is not set, or is set to an incorrect value, application behavior might be undefined.

### SSL Certificate
A file containing the SSL certificate for the HTTPS server should be located in the 'sslcert' folder, with the name 'cert.pem'. Another file containing the key for said certificate should be located in the same folder, with name 'key.pem'.
