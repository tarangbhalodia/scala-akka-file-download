import React, { PureComponent } from "react";
import classes from "./DownloadTableContainer.scss";
import _ from "lodash";

import { downloadFileStatus } from "../../constants";

class DownloadTableContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <th>File</th>
          <th>Status</th>
        </tr>
      </thead>
    );
  };

  renderStatusCell = item => {
    if (item.state === downloadFileStatus.preProcessing) {
      return <div>Obtaining data</div>;
    } else if (item.state === downloadFileStatus.inProgress) {
      return <div>{`Downloading... ${item.progress}%`}</div>;
    } else if (item.state === downloadFileStatus.done) {
      return <div>Done</div>;
    } else if (item.state === downloadFileStatus.error) {
      return <div>Failed</div>;
    } else {
      return <div>Loading...</div>;
    }
  };

  renderRows = data => {
    return _.map(data, item => {
      return (
        <tr key={item.id}>
          <td>
            <div>
              <div className={classes.statusMainText}> {item.url}</div>
              <div
                className={classes.statusSubText}
                style={{
                  color: item.error ? "red" : "black"
                }}
              >
                {item.error || item.fileName}
              </div>
            </div>
          </td>
          <td>{this.renderStatusCell(item)}</td>
        </tr>
      );
    });
  };

  renderTable = () => {
    const { data } = this.props;
    return (
      <div className={classes.tableContainer}>
        <table className={"table table-hover"}>
          {this.renderTableHeader()}
          <tbody>{this.renderRows(data)}</tbody>
        </table>
      </div>
    );
  };

  render() {
    return (
      <div className={classes.mainContainer}>
        <div className={classes.header}>Downloads</div>
        {this.renderTable()}
      </div>
    );
  }
}

DownloadTableContainer.defaultProps = {
  data: []
};

export default DownloadTableContainer;
