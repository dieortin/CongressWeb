# CongressWeb
CongressWeb is a web application running on NodeJS with the purpose of showcasing the 2018 Spanish-Portuguese Relativity Encounter and handling registrations.

# Running the server

### Installing the dependencies
Run `$ yarn install` inside the project folder in order to install the required packages for running the server

### Starting the server
Run `$ yarn start`. If you want to see detailed logs, you should set the `DEBUG` environment variable to `congressweb:*` or just run `$DEBUG=congressweb:* yarn start`

### Configuration file
The server requires some environment variables (or a .env file in the project root) 
to be set in order to run:
* SESSION_SECRET (random string)
* DATABASE_HOST
* DATABASE_USER
* DATABASE_PASSWORD
* DATABASE_PORT
* DATABASE_PATH
* RECAPTCHA_SECRET (the string that you got from Google Recaptcha)
* REGISTRATION_OPENING (for example: 'December 17, 1995 03:24:00')
* NODE_ENV (if not set, Node will use 'development')
* APP_MOUNT_DIR (directory of the server in which the server should listen for requests)

### SSL Certificate
A file containing the SSL certificate for the HTTPS server should be located in the 'sslcert' folder, with the name 'cert.pem'. Another file containing the key for said certificate should be located in the same folder, with name 'key.pem'.
