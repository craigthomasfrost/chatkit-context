import React, { Component, Fragment } from 'react';
import { ChatkitContext } from '.';

/* This is an example of a component that consumes the value of the Context Provider,
   which is the currentUser object. This means that we can use currentUser to perform
   actions in Chatkit without having to reinstantiate, like subscribing to a room. */

class MessageList extends Component {
  static contextType = ChatkitContext;

  state = {
    messages: [],
  };

  componentDidMount() {
    const currentUser = this.context.currentUser;
    currentUser
      .subscribeToRoomMultipart({
        roomId: currentUser.rooms[0].id,
        hooks: {
          onMessage: message => {
            this.setState({
              messages: [...this.state.messages, message],
            });
          },
        },
      })
      .then(() => {
        this.setState({ userId: currentUser.id });
        this.props.autoScroll && this.scrollToBottom();
      });
  }

  componentDidUpdate() {
    this.props.autoScroll && this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.bottom.scrollIntoView({ behavior: 'smooth' });
  };

  /* We're using the Render Prop pattern here so that structure and styling can be
     handled by the user. This just provides the data, and means the user will create
     a 'function as a child' to render out components that have access to the data. */

  render() {
    return this.props.autoScroll ? (
      <Fragment>
        {this.props.children(this.state)}
        <span
          style={{ opacity: 0, width: 0, height: 0 }}
          ref={el => (this.bottom = el)}
        >
          Bottom
        </span>
      </Fragment>
    ) : (
      this.props.children(this.state)
    );
  }
}

export default MessageList;
