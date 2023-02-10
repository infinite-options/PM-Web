import React from "react";
import Check from "../icons/Check.svg";
import Checkbox_unfilled from "../icons/Checkbox_unfilled.svg";
import Checkbox_filled from "../icons/Checkbox_filled.svg";
class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checked !== this.props.checked) {
      this.setState({ checked: this.props.checked });
    }
  }
  onClick = () => {
    if (this.props.onClick !== undefined) {
      this.props.onClick(!this.state.checked);
      // console.log(this.state.checked);
    }

    if (this.props.checked === undefined) {
      this.setState({ checked: !this.state.checked });
      // console.log(this.state.checked);
    }
  };

  render() {
    const color = this.state.checked ? "black" : "white";

    return (
      <>
        {this.props.type === "CIRCLE" ? (
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: color,
              borderRadius: "50%",
              border: "1px solid black",
              padding: "2px",
              margin: "0 5px",
              backgroundClip: "content-box",
              display: "inline-block",
            }}
            onClick={this.onClick}
          />
        ) : this.props.type === "BOX" ? (
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "1px solid black",
              padding: "2px",
              margin: "0 5px",
              display: "inline-block",
            }}
            onClick={this.onClick}
          >
            <div className="h-100 w-100 d-flex justify-content-center align-items-center">
              {this.state.checked ? (
                <img src={Checkbox_filled} alt="Checkbox filled" />
              ) : (
                <img src={Checkbox_unfilled} alt="Check unfilled" />
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
}

export default Checkbox;
