# Stage 1: Build stage with Maven and JDK 17 (official Maven image with JDK 17)
FROM maven:3.9.11-amazoncorretto-21-alpine AS build

WORKDIR /opt/app

# Copy Maven configuration and source code
COPY pom.xml .
COPY src ./src

# Build the application skipping tests for speed
RUN mvn clean install -DskipTests


# Stage 2: Runtime stage with Amazon Corretto 21 (Debian-based)
FROM public.ecr.aws/amazoncorretto/amazoncorretto:21

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /opt/app/target/home-iot-controller-*.jar ./home-iot-controller.jar

# Setup New Relic agent
RUN mkdir -p /usr/local/newrelic
ADD ./newrelic/newrelic.jar /usr/local/newrelic/newrelic.jar
ADD ./newrelic/newrelic.yml /usr/local/newrelic/newrelic.yml

# Set timezone environment variable
ENV TZ=Asia/Kolkata

# Expose the Spring Boot default port
EXPOSE 8080

# Run application with New Relic agent
ENTRYPOINT ["java", "-javaagent:/usr/local/newrelic/newrelic.jar", "-jar", "home-iot-controller.jar"]
