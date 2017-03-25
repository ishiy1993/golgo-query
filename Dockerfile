FROM openjdk:8-jre

COPY backend/target/golgo-query.jar /work/
COPY frontend/build/ /work/public/

WORKDIR /work
CMD ["java", "-jar", "golgo-query.jar"]
