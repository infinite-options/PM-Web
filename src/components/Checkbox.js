import React from 'react';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.checked !== this.props.checked) {
      this.setState({checked: this.props.checked})
    }
  }
  onClick = () => {
    this.props.onClick(!this.state.checked);
    this.setState({checked: !this.state.checked});
  }
  render() {
    const color = (this.state.checked ? 'black' : 'white');
    return (
      <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: color,
          borderRadius: '50%',
          border: '1px solid black',
          padding: '2px',
          margin: '0 5px',
          backgroundClip: 'content-box',
          display: 'inline-block'
      }} onClick={this.onClick}/>
    );
  }
}

export default Checkbox;
