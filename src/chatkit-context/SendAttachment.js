import { Component } from 'react';
import { ChatkitContext } from '.';

/* The fun thing is that we can abstract away parts of the API that aren't usually their
   own functions. This component allows the user to send an attachment by sending a
   multipart message witha single attachment part, making it easier to reason about. */

class SendAttachment extends Component {
  static contextType = ChatkitContext;

  state = {};

  componentDidMount() {
    this.setState({
      handleChange: this.handleChange,
    });
  }

  handleChange = event => {
    const file = event.target.files[0];
    if (!file) return;
    const currentUser = this.context.currentUser;
    currentUser.sendMultipartMessage({
      roomId: currentUser.rooms[0].id,
      parts: [{ file: file }],
    });
  };

  render() {
    return this.props.children(this.state);
  }
}

export default SendAttachment;
