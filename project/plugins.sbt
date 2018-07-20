/*resolvers += Resolver.url(
  "bintray-sbt-plugin-releases",
   url("http://dl.bintray.com/content/sbt/sbt-plugin-releases"))(
       Resolver.ivyStylePatterns)*/

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.6.15")
//addSbtPlugin("org.ensime" % "sbt-ensime" % "2.5.1")
//addSbtPlugin("com.github.ddispaltro" % "sbt-reactjs" % "0.6.8")

// lazy val root = project.in( file(".") ).dependsOn( sbtReactjs ).settings(
//   //harmony := true
// )
// lazy val sbtReactjs = RootProject(file("./sbt-reactjs"))

// dependencyOverrides += "org.webjars.npm" % "js-tokens" % "3.0.2"