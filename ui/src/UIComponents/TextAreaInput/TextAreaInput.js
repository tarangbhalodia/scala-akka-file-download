import PropTypes from "prop-types";
import React from "react";
import classes from "./TextAreaInput.scss";
import Textarea from "react-textarea-autosize";
import classNames from "classnames";
import { ViewInputField, UILabel } from "UIComponents";
import { removeAsterisk } from "Utils";
import UIBaseComponent from "UIComponents/UIBaseComponent";
import _ from "lodash";

class TextAreaInput extends UIBaseComponent {
  constructor(props) {
    super(props);
    const baseState = this.getBaseState();
    this.state = {
      keysDown: {},
      ...baseState,
      value: props.value,
      updateDebounce: _.debounce(this.handleUpdateValue, 100)
    };
  }

  handleKeyDown = event => {
    let kd = this.state.keysDown;
    kd[event.keyCode] = true;
    this.setState({ keysDown: kd });
    if (kd[16] && kd[13] && this.props.allowShiftEnter) {
      event.preventDefault();
      let param = {};
      let updateVal = `${event.target.value}\r`;
      kd[event.keyCode] = false;
      this.setState({ keysDown: kd });
      param[event.target.name] = updateVal;
      this.props.updateInputField(param);
    } else if (event.key == "Enter" && this.props.onEnterPress) {
      event.preventDefault();
      this.props.onEnterPress(event.target.value);
    }
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  };

  handleKeyUp = e => {
    if (this.props.onEnterPress) {
      let kd = this.state.keysDown;
      kd[e.keyCode] = false;
      this.setState({ keysDown: kd });
    }
    if (this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }
  };

  handleInputChange = e => {
    this.setState({ value: e.target.value });
    this.state.updateDebounce();
  };

  handleUpdateValue = () => {
    this.updateValue(this.state.value);
  };

  handleBlur = e => {
    if (this.props.onBlur != undefined) {
      this.props.onBlur(e.target.value);
    }
  };

  updateStateValue = value => {
    this.setState({ value: value });
  };

  renderChildren() {
    const {
      disabled,
      maxRows,
      minRows,
      textAreaStyles,
      name,
      inputRef,
      placeholder,
      autoFocus,
      showMaxCharacterLength,
      maxLength,
      className,
      errorStyle,
      value
    } = this.props;
    const { error } = this.state;
    let inputText = classNames(
      { [classes.inputText]: true },
      { [classes.inputTextDisable]: disabled },
      { [classes.error]: error != "" },
      { [className]: true }
    );

    let updatedInputStyle = { ...textAreaStyles };

    if (disabled) {
      updatedInputStyle = { ...updatedInputStyle, cursor: "not-allowed" };
    }
    if (error) {
      updatedInputStyle = { ...updatedInputStyle, ...errorStyle };
    }

    return (
      <div className={classes.container}>
        <Textarea
          disabled={disabled}
          maxRows={maxRows}
          minRows={minRows}
          className={inputText}
          type="text"
          value={value ? value : ""}
          onChange={e => this.updateValue(e.target.value)}
          onKeyDown={e => this.handleKeyDown(e)}
          onKeyUp={e => this.handleKeyUp(e)}
          onBlur={e => this.handleBlur(e)}
          style={updatedInputStyle}
          name={name}
          inputRef={inputRef}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        {showMaxCharacterLength && !isdisabled ? (
          <div className={classes.inputLength}>{maxLength - value.length}</div>
        ) : null}
      </div>
    );
  }
}

TextAreaInput.defaultProps = {
  textAreaStyles: {},
  minRows: 3,
  allowShiftEnter: false,
  showMaxCharacterLength: false,
  autoFocus: false
};

TextAreaInput.propTypes = {
  showMaxLength: PropTypes.bool,
  maxRows: PropTypes.number,
  minRows: PropTypes.number,
  maxLength: PropTypes.number,
  textAreaStyles: PropTypes.object,
  onEnterPress: PropTypes.func,
  onBlur: PropTypes.func,
  allowShiftEnter: PropTypes.bool,
  inputRef: PropTypes.func,
  autoFocus: PropTypes.bool,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func
};

export default TextAreaInput;
