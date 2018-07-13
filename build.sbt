name := """avenir-web"""
organization := "com.quest"

version := "1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, SbtWeb)
  .settings(
  )

scalaVersion := "2.12.6"

libraryDependencies += guice
libraryDependencies += jdbc

libraryDependencies ++= Seq(
  "org.webjars" %% "webjars-play" % "2.6.3",
  "org.webjars" % "bootstrap" % "3.1.1-2",
  "org.webjars" % "marked" % "0.3.2",
  "org.webjars" % "jquery" % "2.1.4"
)

libraryDependencies += "net.codingwell" %% "scala-guice" % "4.2.1"
libraryDependencies += "org.playframework.anorm" %% "anorm" % "2.6.1"
// https://mvnrepository.com/artifact/org.spark-project.hive/hive-jdbc
//libraryDependencies += "org.spark-project.hive" % "hive-jdbc" % "1.2.1.spark2"
// https://mvnrepository.com/artifact/org.apache.hadoop/hadoop-client
libraryDependencies += "org.apache.hadoop" % "hadoop-client" % "3.1.0"
// https://mvnrepository.com/artifact/com.zaxxer/HikariCP
libraryDependencies += "com.zaxxer" % "HikariCP" % "3.2.0"

libraryDependencies ++= Seq(
  "org.apache.curator" % "curator-framework" % "2.6.0",
  "org.apache.hive" % "hive-common" % "1.2.2",
  "org.apache.hive" % "hive-service" % "1.2.2",
  "org.apache.hive" % "hive-serde" % "1.2.2",
  "org.apache.hive" % "hive-metastore" % "1.2.2",
  "org.apache.hive" % "hive-shims" % "1.2.2",
  "org.apache.httpcomponents" % "httpclient" % "4.4",
  "org.apache.httpcomponents" % "httpcore" % "4.4",
  "org.apache.thrift" % "libthrift" % "0.9.2",
  "org.apache.zookeeper" % "zookeeper" % "3.4.6"
)


libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test

fork in Test := false

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "com.quest.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "com.quest.binders._"
