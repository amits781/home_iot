FROM maven:3.8.1-jdk-11-slim AS build

WORKDIR /opt/app

COPY ./src src
COPY pom.xml .

RUN mvn -f pom.xml clean install -DskipTests

FROM adoptopenjdk/openjdk11:jre-11.0.15_10-alpine

COPY --from=build /opt/app/target/home-iot-controller-*.jar home-iot-controller.jar
RUN mkdir -p /usr/local/newrelic
ADD ./newrelic/newrelic.jar /usr/local/newrelic/newrelic.jar
ADD ./newrelic/newrelic.yml /usr/local/newrelic/newrelic.yml
ENV TZ=Asia/Kolkata


EXPOSE 8080

ENTRYPOINT ["java", "-javaagent:/usr/local/newrelic/newrelic.jar", "-jar", "home-iot-controller.jar"]
