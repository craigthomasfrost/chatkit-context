import { Component } from 'react';
import { ChatkitContext } from '.';

/* We're doing something similar here, but rather than passing in data to be consumed,
   we're passing in methods to be executed. This completely abstracts away message state
   as well as sending logic, so that users don't have to keep rewriting this stuff. */

class SendMessage extends Component {
  static contextType = ChatkitContext;

  state = {
    message: '',
  };

  componentDidMount() {
    this.setState({
      onChange: this.onChange,
      onSubmit: this.onSubmit,
    });
  }

  onChange = event => {
    this.setState({
      message: event.target.value,
    });
  };

  onSubmit = event => {
    event.preventDefault();
    if (!this.state.message) return;
    const currentUser = this.context.currentUser;
    currentUser
      .sendSimpleMessage({
        roomId: currentUser.rooms[0].id,
        text: this.state.message,
      })
      .then(() =>
        this.setState({
          message: '',
        })
      );
  };

  render() {
    return this.props.children(this.state);
  }
}

export default SendMessage;
