FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar agent-service.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "agent-service.jar"]