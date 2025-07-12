# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim AS build

# Set the working directory for the build
WORKDIR /app

# Copy Gradle wrapper and configuration files
COPY gradlew settings.gradle build.gradle /app/
COPY gradle /app/gradle

# Download dependencies
RUN ./gradlew dependencies --no-daemon

# Copy the source code
COPY src /app/src

# Build the application (skip all tests for production container)
RUN ./gradlew build --no-daemon -x test

# Use a smaller image for the runtime
FROM openjdk:21-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/build/libs/api-gateway-*.jar app.jar

# Expose the port your Spring Boot application runs on
EXPOSE 8085

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
