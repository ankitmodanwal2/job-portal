FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8081
ENV JWT_SECRET=${JWT_SECRET}
ENTRYPOINT ["java", "-jar", "app.jar"]