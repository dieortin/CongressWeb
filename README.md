# CongressWeb
CongressWeb is a web application running on NodeJS with the purpose of showcasing
the 2018 Spanish-Portuguese Relativity Encounter and handling registrations.

# Running the server

### Configuration file
The server requires some environment variables (or a .env file in the project root) 
to be set in order to run:
* SESSION_SECRET
* DATABASE_HOST
* DATABASE_USER
* DATABASE_PASSWORD
* DATABASE_PORT
* DATABASE_PATH

### SSL Certificate
A file containing the SSL certificate for the HTTPS server should be located in the 'sslcert' folder, with the name 'server.crt'. Another file containing the key for said certificate should be located in the same folder, with name 'key.pem'.
