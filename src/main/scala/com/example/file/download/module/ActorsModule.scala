package com.example.file.download.module

import com.example.file.download.workers.{FTPDownloadWorker, FileDownloadWorker, HTTPDownloadWorker}
import com.google.inject.AbstractModule
import play.api.libs.concurrent.AkkaGuiceSupport

class ActorsModule extends AbstractModule with AkkaGuiceSupport {
  override def configure(): Unit = {
    bindActor[FileDownloadWorker]("file-download-worker")
    bindActor[HTTPDownloadWorker]("http-file-download-worker")
    bindActor[FTPDownloadWorker]("ftp-file-download-worker")
  }
}
