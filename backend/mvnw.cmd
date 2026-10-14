@echo off
setlocal
if not defined JAVA_HOME (
    set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
)
set "MAVEN_CMD=C:\Users\ASUS TUF F17\AppData\Local\Programs\Maven\apache-maven-3.9.9\bin\mvn.cmd"
"%MAVEN_CMD%" %*
exit /b %ERRORLEVEL%
