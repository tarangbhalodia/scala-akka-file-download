import React, { PureComponent } from "react";
import classes from "./MainContainer.scss";

import DownloadTableContainer from "../DownloadTableContainer";

import FileDownloader from "../../Utils/FileDownloader";

import shortid from "shortid";

import { downloadFileStatus } from "../../constants";

import _ from "lodash";

class MainContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputUrl: "",
      data: []
    };

    var path = require("path");
    //Extract the filename:
    var filename = path.basename("/Users/Refsnes/demo_path.js?so=1");
    console.log(filename);
  }

  saveBlob(blob, fileName) {
    console.log("saved");
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }

  updateProgress(oEvent) {
    if (oEvent.lengthComputable) {
      var percentComplete = (oEvent.loaded / oEvent.total) * 100;
      console.log(percentComplete);
      // ...
    } else {
      // Unable to compute progress information since the total size is unknown
    }
  }

  findIndex = id => {
    return _.findIndex(this.state.data, { id });
  };

  onProgress = ({ id, progress, lengthComputable }) => {
    const index = this.findIndex(id);
    if (index !== -1) {
      if (lengthComputable) {
        // set progressType definite
        const newData = [...this.state.data];
        newData[index].progressType = "definite";
        newData[index].progress = progress;
        newData[index].state = downloadFileStatus.inProgress;
        this.setState({ data: newData });
      } else {
        // set progressType indefinite
        const newData = [...this.state.data];
        newData[index].state = downloadFileStatus.inProgress;
        newData[index].progressType = "indefinite";
        this.setState({ data: newData });
      }
    }
  };

  onFileNameObtained = ({ id, fileName }) => {
    const index = this.findIndex(id);
    if (index !== -1) {
      const newData = [...this.state.data];
      newData[index].fileName = fileName;
      newData[index].state = downloadFileStatus.inProgress;
      this.setState({ data: newData });
    }
    // set fileName
  };

  onDone = ({ id }) => {
    // set state DONE
    const index = this.findIndex(id);
    if (index != -1) {
      const newData = [...this.state.data];
      newData[index].state = downloadFileStatus.done;
      this.setState({ data: newData });
    }
  };

  onError = ({ id, error }) => {
    // set state ERROR
    const index = this.findIndex(id);
    if (index != -1) {
      const newData = [...this.state.data];
      newData[index].state = downloadFileStatus.error;
      newData[index].error = error;
      this.setState({ data: newData });
    }
  };

  downloadFile = url => {
    const newData = [...this.state.data];
    const newItem = {
      id: shortid.generate(),
      url,
      fileName: null,
      done: false,
      progress: 0,
      progressType: "indefinite",
      state: downloadFileStatus.preProcessing,
      error: null
    };
    const fileDownloader = new FileDownloader({
      id: newItem.id,
      url,
      onFileNameObtained: this.onFileNameObtained,
      onProgress: this.onProgress,
      onDone: this.onDone,
      onError: this.onError
    });
    fileDownloader.startDownload();
    newItem.downloader = fileDownloader;
    newData.push(newItem);
    this.setState({ data: newData, inputUrl: "" });
  };

  updateValue = value => {
    this.setState({ inputUrl: value });
  };

  handleKeyDown = e => {
    if (e.key === "Shift" && event.key === "Enter") {
      event.preventDefault();
    } else if (event.key === "Enter") {
      event.preventDefault();
      this.downloadFile(e.target.value);
    }
    if (event.key === " ") {
      event.preventDefault();
    }
  };

  handleKeyUp = e => {};

  handleBlur = e => {};

  render() {
    const { inputUrl: value, data } = this.state;
    return (
      <div className={classes.container}>
        <input
          disabled={false}
          maxRows={1}
          minRows={1}
          className={classes.inputText}
          type="text"
          value={value ? value : ""}
          onChange={e => this.updateValue(e.target.value)}
          onKeyDown={e => this.handleKeyDown(e)}
          onKeyUp={e => this.handleKeyUp(e)}
          onBlur={e => this.handleBlur(e)}
          name={"downloadUrl"}
          //   inputRef={inputRef}
          placeholder={"Type in URL and Press ENTER to start download"}
          autoFocus={true}
        />
        <div className={classes.tableContainer}>
          <DownloadTableContainer data={data} />
        </div>
      </div>
    );
  }
}

export default MainContainer;
