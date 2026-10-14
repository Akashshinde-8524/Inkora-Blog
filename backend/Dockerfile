# =========================================================
# Stage 1: Build the Spring Boot application using Maven
# =========================================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and POM first to leverage Docker layer caching
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn/

RUN chmod +x ./mvnw
# Download dependencies offline
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and package executable fat JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# =========================================================
# Stage 2: Minimal, secure JRE production runtime image
# =========================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add unprivileged user for security
RUN addgroup -S inkora && adduser -S inkora -G inkora

# Create uploads directory with appropriate permissions
RUN mkdir -p /app/uploads/images/covers \
             /app/uploads/images/content \
             /app/uploads/images/avatars && \
    chown -R inkora:inkora /app

# Copy the built jar from builder stage
COPY --from=builder /app/target/inkora-backend-0.0.1-SNAPSHOT.jar app.jar
RUN chown inkora:inkora app.jar

USER inkora

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
