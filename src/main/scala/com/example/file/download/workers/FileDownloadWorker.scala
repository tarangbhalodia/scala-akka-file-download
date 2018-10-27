package com.example.file.download.workers

import java.io.File

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.http.scaladsl.model.Uri
import akka.pattern._
import akka.stream.IOResult
import akka.util.Timeout
import com.example.file.download.action.{Download, DownloadComplete}
import javax.inject.{Inject, Named}
import play.api.Configuration

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

class FileDownloadWorker @Inject()(
    configuration: Configuration,
    @Named("http-file-download-worker") httpDownloadWorker: ActorRef,
    @Named("ftp-file-download-worker") ftpDownloadWorker: ActorRef)(implicit executionContext: ExecutionContext)
    extends Actor
    with ActorLogging {

  private lazy val downloadFilePath = configuration.get[String]("downloadFilePath")
  private lazy implicit val actorTimeOut: Timeout = 60 minutes

  override def receive: Receive = {
    case download: Download =>
      val fileName = download.url.split("/").last
      val uri = Uri(download.url)
      val localFile = new File(downloadFilePath + "/" + fileName)

      val actorRef = uri.scheme match {
        case "http" | "https" => httpDownloadWorker
        case "ftp"            => ftpDownloadWorker
        case _                => throw new Exception("unsupported protocol")
      }

      val result = for {
        downloadResult <- actorRef ? (uri, localFile)
      } yield
        downloadResult match {
          case ioResult: IOResult =>
            if (ioResult.wasSuccessful) {
              log.info(s"download successful with size: ${ioResult.count}")
              ioResult
            } else throw ioResult.getError
          case _ => throw new Exception("unknown response type")
        }
      result.map(r => DownloadComplete(fileName, r.count)) pipeTo sender()

    case _ => ???
  }
}
