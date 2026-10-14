# =========================================================
# Stage 1: Build using official Maven with Temurin 21
# =========================================================
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

ENV MAVEN_OPTS="-Xmx384m"

# Copy POM and resolve dependencies
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B || true

# Copy source and build executable JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# =========================================================
# Stage 2: Minimal, secure JRE production runtime image
# =========================================================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Create unprivileged user
RUN useradd -m -u 1001 inkora

# Create uploads directory with correct permissions
RUN mkdir -p /app/uploads && chown -R inkora:inkora /app

# Copy built JAR from builder stage
COPY --from=builder /app/target/inkora-backend-0.0.1-SNAPSHOT.jar app.jar
RUN chown inkora:inkora app.jar

USER inkora

EXPOSE 8080

ENV JAVA_OPTS="-Xmx384m -Xms128m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
