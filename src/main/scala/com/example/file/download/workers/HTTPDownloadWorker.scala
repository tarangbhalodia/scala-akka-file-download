package com.example.file.download.workers

import java.io.File

import akka.actor.{Actor, ActorLogging, ActorSystem}
import akka.http.scaladsl.Http
import akka.http.scaladsl.client.RequestBuilding.Get
import akka.http.scaladsl.model.{HttpResponse, Uri}
import akka.pattern._
import akka.stream._
import akka.stream.scaladsl._
import akka.util.ByteString
import javax.inject.Inject

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

class HTTPDownloadWorker @Inject()(implicit executionContext: ExecutionContext, actorSystem: ActorSystem) extends Actor with ActorLogging {

  private lazy implicit val actorMaterializer: ActorMaterializer = ActorMaterializer()

  def downloadViaFlow(uri: Uri, file: File): Future[IOResult] = {
    val request = Get(uri)
    val source = Source.single((request, ()))
    val requestResponseFlow = Http().superPool[Unit]()
    source.via(requestResponseFlow).map(responseOrFail).flatMapConcat(responseToByteSource).runWith(FileIO.toPath(file.toPath))
  }

  def responseOrFail[T](in: (Try[HttpResponse], T)): (HttpResponse, T) = in match {
    case (responseTry, ctx) => (responseTry.get, ctx)
  }

  def responseToByteSource[T](in: (HttpResponse, T)): Source[ByteString, Any] = in match {
    case (response, _) => response.entity.dataBytes
  }

  override def receive: Receive = {
    case (uri: Uri, file: File) => downloadViaFlow(uri, file) pipeTo sender()
    case _                      => ???
  }
}
