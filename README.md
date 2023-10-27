# Hilla Basics Tutorial: Hilla CRM

Hilla is a full-stack web framework for Java. It can help you build better business applications faster by combining a Spring Boot backend with a React frontend. Plus, it has more than forty UI components that you can utilize for a more professional application. 

This example project shows a full-stack CRM application built using Hilla. You can find the step-by-step instructions for re-creating this app in the [Hilla documentation](https://hilla.dev/docs).

## Running the application

The project is a standard Maven project. To run it from the command line,
type `mvn` then open http://localhost:8080 in your browser.

## Deploying to Production

To create a production build, call `mvn clean package -Pproduction`.
This will build a JAR file with all the dependencies and front-end resources,
ready to be deployed. The file can be found in the `target` folder after the build completes.

Once the JAR file is built, you can run it using
`java -jar target/hilla-crm-1.0-SNAPSHOT.jar`.

## Useful links

- Read the documentation at [hilla.dev/docs](https://hilla.dev/docs/).
- Ask questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/hilla) or join our [Discord channel](https://discord.gg/MYFq5RTbBn).
- Report issues, create pull requests in [GitHub](https://github.com/vaadin/hilla).
