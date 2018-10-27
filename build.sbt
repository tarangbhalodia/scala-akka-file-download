import Dependencies._
name := "file-download"

version := "1.0"

scalaVersion := "2.12.7"

libraryDependencies ++= Seq(
  guice,
  "com.typesafe.akka" %% "akka-actor" % akkaVersion ,
  "com.typesafe.akka" %% "akka-testkit" % akkaVersion ,
  "ai.x" %% "play-json-extensions" % playJsonExtensionVersion exclude("org.scala-lang", "scala-compiler"),
  "org.scalatestplus.play" %% "scalatestplus-play" % scalaTestPlusPlayVersion % Test,
)

libraryDependencies += "com.typesafe.akka" %% "akka-http" % akkaHttpVersion
libraryDependencies ++= Seq(
  "com.lightbend.akka" %% "akka-stream-alpakka-file" % alpAkkaVersion,
  "com.lightbend.akka" %% "akka-stream-alpakka-ftp" % alpAkkaVersion
)

enablePlugins(PlayScala)
disablePlugins(PlayNettyServer, PlayLayoutPlugin)
