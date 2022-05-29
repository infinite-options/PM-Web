import React from "react";
import Check from "../icons/Check.svg";

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked,
      default: this.props.default,
    };
    console.log(this.state.checked, this.state.default);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checked !== this.props.checked) {
      this.setState({ checked: this.props.checked });
    }
    if (prevProps.default !== this.props.default) {
      this.setState({ default: this.props.default });
    }
  }
  onClick = () => {
    if (this.props.onClick !== undefined) {
      this.props.onClick(!this.state.checked);
      console.log(this.state.checked);
    }
    if (this.props.checked === undefined) {
      this.setState({ checked: !this.state.checked });
      console.log(this.state.checked);
    }
    if (this.props.onClick !== undefined) {
      this.props.onClick(!this.state.default);
      console.log(this.state.default);
    }
    if (this.props.default === undefined) {
      this.setState({ default: !this.state.default });
      console.log(this.state.default);
    }
  };

  render() {
    const color = this.state.checked || this.state.default ? "black" : "white";

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
              {this.state.checked || this.state.default ? (
                <img src={Check} alt="Check" />
              ) : (
                ""
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
