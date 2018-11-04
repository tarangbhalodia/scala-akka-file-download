import React from "react";

class FileDownloader extends Object {
  constructor(props) {
    super(props);
    this.props = props;
    this.xhr = new XMLHttpRequest();

    this.fileNameObtained = false;

    console.log(this.props);

    this.updateProgress = this.updateProgress.bind(this);
  }

  saveBlob = (blob, fileName) => {
    console.log("saved");
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  };

  updateProgress(oEvent) {
    const { id, url, onProgress, onFileNameObtained } = this.props;
    if (oEvent.lengthComputable) {
      var percentComplete = Number.parseInt(
        (oEvent.loaded / oEvent.total) * 100
      );
      onProgress({
        id,
        progress: percentComplete,
        lengthComputable: true
      });
      // ...
    } else {
      // Unable to compute progress information since the total size is unknown
      onProgress({ id, lengthComputable: false });
    }

    if (this.getContentType()) {
      let fileName = this.getFilename(url);
      if (!this.fileNameObtained) {
        onFileNameObtained({ id, fileName });
        this.fileNameObtained = true;
      }
    }
  }

  getContentType = () => {
    return this.xhr.getResponseHeader("Content-Type");
  };

  getFilename(url) {
    var contentType = this.getContentType();
    const urlLastPortion = url.substring(url.lastIndexOf("/") + 1);
    let fileName = urlLastPortion;
    if (this.doesURLhasFileName(url)) {
      return fileName;
    } else {
      if (contentType) {
        const contentTypeSplit = contentType.split("/");
        if (contentTypeSplit.length > 1) {
          fileName = `${urlLastPortion}.${contentTypeSplit[1]}`;
          return fileName;
        }
      }
    }
    return fileName;
  }

  doesURLhasFileName = url => {
    const lastPortion = url.substring(url.lastIndexOf("/") + 1);
    if (lastPortion.includes(".")) {
      return true;
    } else {
      return false;
    }
  };

  onReadyStateChanged = (e, xhr) => {
    const { id, url, onFileNameObtained } = this.props;
    if (xhr.readyState == 4) {
      let fileName = this.getFilename(url);
      if (!this.fileNameObtained) {
        onFileNameObtained({ id, fileName });
        this.fileNameObtained = true;
      }
    }
  };

  startDownload = () => {
    const { id, url, onDone, onError } = this.props;
    const xhr = this.xhr;
    var json_obj,
      status = false;
    xhr.addEventListener("progress", this.updateProgress);
    xhr.open("GET", `https://cors-anywhere.herokuapp.com/${url}`, true);
    xhr.responseType = "blob";
    xhr.onload = e => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var blob = xhr.response;

          const fileName = this.getFilename(url);
          this.saveBlob(blob, fileName);
          onDone({ id });
        } else {
          console.error(xhr.statusText);
          onError({ id: id, error: xhr.statusText });
        }
      }
    };
    xhr.onreadystatechange = e => this.onReadyStateChanged(e, xhr);
    xhr.onerror = function(e) {
      console.error(xhr.statusText);
      onError({ id: id, error: xhr.statusText });
    };

    xhr.send();
  };
}

export default FileDownloader;
