# =========================================================
# Stage 1: Build the Spring Boot application using Maven
# =========================================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Install Maven in Alpine
RUN apk add --no-cache maven

# Copy POM and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy source code and package fat JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# =========================================================
# Stage 2: Minimal, secure JRE production runtime image
# =========================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add unprivileged user
RUN addgroup -S inkora && adduser -S inkora -G inkora

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R inkora:inkora /app

# Copy built JAR from builder stage
COPY --from=builder /app/target/inkora-backend-0.0.1-SNAPSHOT.jar app.jar
RUN chown inkora:inkora app.jar

USER inkora

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
