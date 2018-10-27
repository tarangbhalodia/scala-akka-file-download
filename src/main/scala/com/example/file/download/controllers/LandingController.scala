package com.example.file.download.controllers

import akka.actor.ActorRef
import akka.pattern._
import akka.util.Timeout
import com.example.file.download.action.{DownloadComplete, Download}
import javax.inject.{Inject, Named, Singleton}
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents, Request}

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

@Singleton
class LandingController @Inject()(cc: ControllerComponents, @Named("file-download-worker") fileDownloadWorker: ActorRef)(
    implicit executionContext: ExecutionContext)
    extends AbstractController(cc) {

  private implicit lazy val actorTimeOut: Timeout = 60 minutes

  def index() = Action.async { implicit request: Request[AnyContent] =>
    val result = fileDownloadWorker ? Download("ftp://speedtest.tele2.net/100GB.zip")
    result.map(r => Ok(Json.toJson(r.asInstanceOf[DownloadComplete])))
  }
}
