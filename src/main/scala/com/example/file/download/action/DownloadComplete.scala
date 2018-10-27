package com.example.file.download.action

import play.api.libs.json.OFormat

case class DownloadComplete(fileName: String, fileSizeInBytes: Long)

object DownloadComplete {
  implicit val dealershipFormat: OFormat[DownloadComplete] =
    ai.x.play.json.Jsonx.formatCaseClass[DownloadComplete]
}
