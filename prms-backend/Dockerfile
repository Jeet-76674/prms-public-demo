# ==============================================================================
# Stage 1: Build the Spring Boot application using Maven Wrapper
# ==============================================================================
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app

# Copy Maven wrapper files and project configuration first for efficient layer caching
COPY pom.xml mvnw ./
COPY .mvn .mvn/

# Ensure Unix line endings and executable permission for the Maven wrapper script
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Download dependencies offline (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy project source code and compile production JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# ==============================================================================
# Stage 2: Minimal Production JRE Runtime Image
# ==============================================================================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Create a dedicated non-root user and group for application security
RUN groupadd -r prms && useradd -r -g prms -d /app -s /sbin/nologin prms

# Create required runtime upload folders and assign permissions to non-root user
RUN mkdir -p uploads/samples uploads/resumes uploads/job-descriptions uploads/company-logos uploads/profile-images \
    && chown -R prms:prms /app

# Copy the compiled Spring Boot executable JAR from the builder stage
COPY --from=builder /app/target/prms-backend-*.jar app.jar

# Copy safe demo baseline sample files
COPY uploads/samples/sample-resume.pdf ./uploads/samples/
COPY uploads/samples/sample-jd.pdf ./uploads/samples/

# Ensure all application files are owned by the non-root user
RUN chown -R prms:prms /app

# Switch to non-root execution
USER prms

# Render dynamically injects the PORT environment variable (defaults to 8080 locally)
ENV PORT=8080
EXPOSE 8080

# Launch Spring Boot with dynamic port binding and faster container startup randomness
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
