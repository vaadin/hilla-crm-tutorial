# Learn Vaadin Hilla Course: CRM Example Application

This repo contains the source code for the [Vaadin Hilla in-depth course](https://hilla.dev/docs/tutorials/in-depth-course).

## Requirements

- Java JDK 11 or later
- Maven 3.6 or later

## Generating App Secret for JWT

Run the following commands to create an app secret for generating JWTs. This file is ignored in `.gitignore` so you don't commit it by acciden. Read the production chapter of the tutorial for instructions on how to generate the secret for produciton.

```
mkdir -p config/local/
echo "app.secret=$(openssl rand -base64 32)" > config/local/application.properties
```

## Starting the Development Server

The project uses Spring Boot. You can start the project in development mode by running the `main()` method in `Application.java` or using the default Maven goal from the command line:

```
./mvnw
```
