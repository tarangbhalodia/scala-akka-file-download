package com.example.file.download.workers

import java.io.{File, PrintWriter}
import java.net.InetAddress

import akka.actor.{Actor, ActorLogging, ActorSystem}
import akka.http.scaladsl.model.Uri
import akka.pattern._
import akka.stream._
import akka.stream.alpakka.ftp.FtpSettings
import akka.stream.alpakka.ftp.scaladsl.Ftp
import akka.stream.scaladsl._
import javax.inject.Inject
import org.apache.commons.net.PrintCommandListener
import org.apache.commons.net.ftp.FTPClient

import scala.concurrent.{ExecutionContext, Future}

class FTPDownloadWorker @Inject()(implicit executionContext: ExecutionContext, actorSystem: ActorSystem) extends Actor with ActorLogging {

  private lazy implicit val actorMaterializer: ActorMaterializer = ActorMaterializer()

  override def receive: Receive = {
    case (uri: Uri, file: File) =>
      val settings = FtpSettings(
        InetAddress.getByName(uri.authority.toString())
      ).withBinary(true)
        .withPassiveMode(true)
        .withConfigureConnection((ftpClient: FTPClient) => {
          ftpClient.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(System.out), true))
        })
      downloadFromFtp(uri.path.toString(), settings, file) pipeTo sender()
    case _ => ???
  }

  def downloadFromFtp(sourcePath: String, settings: FtpSettings, file: File): Future[IOResult] =
    Ftp.fromPath(sourcePath, settings).runWith(FileIO.toPath(file.toPath))
}
