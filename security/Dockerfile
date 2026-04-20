FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests


FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar security-service.jar

COPY src/main/resources/application.yaml application.yaml

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "security-service.jar"]