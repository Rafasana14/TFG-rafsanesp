# Graduation Project: Reacting to PetClinic

This is a Graduation Project for the Software Engineer Degree. The main goals for the project were:
- Built the frontend of the Spring PetClinic demo using React
- Create three pricing plans with different features for each one


## Running petclinic locally
You need to launch the backend server first. To do that:
- Launch a terminal inside the root folder and then:
  - In Linux:
   ```
   ./mvnw spring-boot:run
   ```
  - In Windows:
   ```
   mvnw.cmd spring-boot:run
   ```
After that you need to launch the frontend server:
- Launch another terminal inside the ```frontend``` folder and then:

    1. ```npm install``` (this installs the node modules)

    2. ```npm start```

You can then access the application at http://localhost:3000/


## Database configuration

In its default configuration, Petclinic uses an in-memory database (H2) which
gets populated at startup with data. 


## Interesting Spring Petclinic branches and forks

The Spring Petclinic master branch in the main [spring-projects](https://github.com/spring-projects/spring-petclinic)
GitHub org is the "canonical" implementation, currently based on Spring Boot and Thymeleaf. There are
[quite a few forks](https://spring-petclinic.github.io/docs/forks.html) in a special GitHub org
[spring-petclinic](https://github.com/spring-petclinic). If you have a special interest in a different technology stack
that could be used to implement the Pet Clinic then please join the community there.


# License

The Spring PetClinic sample application is released under version 2.0 of the [Apache License](https://www.apache.org/licenses/LICENSE-2.0).

[spring-petclinic]: https://github.com/spring-projects/spring-petclinic
[spring-framework-petclinic]: https://github.com/spring-petclinic/spring-framework-petclinic
[spring-petclinic-angularjs]: https://github.com/spring-petclinic/spring-petclinic-angularjs 
[javaconfig branch]: https://github.com/spring-petclinic/spring-framework-petclinic/tree/javaconfig
[spring-petclinic-angular]: https://github.com/spring-petclinic/spring-petclinic-angular
[spring-petclinic-microservices]: https://github.com/spring-petclinic/spring-petclinic-microservices
[spring-petclinic-reactjs]: https://github.com/spring-petclinic/spring-petclinic-reactjs
[spring-petclinic-graphql]: https://github.com/spring-petclinic/spring-petclinic-graphql
[spring-petclinic-kotlin]: https://github.com/spring-petclinic/spring-petclinic-kotlin
[spring-petclinic-rest]: https://github.com/spring-petclinic/spring-petclinic-rest
