import Dependencies._
name := "file-download"

version := "1.0"

scalaVersion := "2.12.7"

libraryDependencies ++= Seq(
  guice,
  "com.typesafe.akka" %% "akka-actor" % akkaVersion,
  "com.typesafe.akka" %% "akka-testkit" % akkaVersion,
  "com.typesafe.akka" %% "akka-http" % akkaHttpVersion,
  "com.lightbend.akka" %% "akka-stream-alpakka-file" % alpAkkaVersion,
  "com.lightbend.akka" %% "akka-stream-alpakka-ftp" % alpAkkaVersion,
  "ai.x" %% "play-json-extensions" % playJsonExtensionVersion exclude ("org.scala-lang", "scala-compiler"),
  "commons-io" % "commons-io" % commonsIOVersion,
  "org.scalatestplus.play" %% "scalatestplus-play" % scalaTestPlusPlayVersion % Test,
)

enablePlugins(PlayScala)
disablePlugins(PlayNettyServer, PlayLayoutPlugin)
