import React, { Component, Fragment } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import './App.css';

/* Here we're instantiating Context that will be used to hold the currentUser
   object provided by Chatkit. It's the Context Provider shown later that
   will ultimately provide the value; we're not passing in a default value. */

const ChatkitContext = React.createContext();

/* Here we're creating a component that will render the Context Provider, ready
   to be consumed by child components. It's here we instantiate Chatkit and store
   currentUser in state, which is then passed as the value of the Context Provider. */

class Chatkit extends Component {
  state = {};

  componentDidMount() {
    new ChatManager({
      instanceLocator: 'ADD YOUR INSTANCE LOCATOR',
      userId: this.props.userId,
      tokenProvider: new TokenProvider({
        url:
          'ADD YOUR TOKEN PROVIDER URL',
      }),
    })
      .connect()
      .then(currentUser => {
        this.setState({ currentUser });
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* React renders before componentDidMount has completed, which means the first time
     around the value of this.state would be an empty object. To ensure this value is
     available for consumers, we only render the provider when the state has been set. */

  render() {
    return this.state.currentUser ? (
      <ChatkitContext.Provider value={this.state}>
        {this.props.children}
      </ChatkitContext.Provider>
    ) : null;
  }
}

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
            console.log(message);
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

/* Here, we can use a functional component because the state we actually need is
   kept in the relevant Render Prop components. As you can see, components like
   MessageList provide access to the data, and let the user handle the rest. */

const App = () => (
  <Chatkit userId="ADD YOUR USER ID">
    <div className="container">
      <div className="message-list">
        <MessageList autoScroll>
          {({ messages, userId }) =>
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  userId === message.sender.id ? 'message--own' : null
                }`}
              >
                {message.parts.map((part, index) => {
                  if (part.payload.type.includes('image')) {
                    return (
                      <img
                        key={index}
                        src={part.payload._downloadURL}
                        alt={part.payload.name}
                      />
                    );
                  }
                  return (
                    <div key={index} className="message__text">
                      {part.payload.content}
                    </div>
                  );
                })}
              </div>
            ))
          }
        </MessageList>
      </div>
      <SendMessage>
        {({ message, onChange, onSubmit }) => {
          return (
            <form className="form">
              <input
                type="text"
                value={message}
                onChange={onChange}
                placeholder="Write something"
              />
              <SendAttachment>
                {({ handleChange }) => (
                  <label className="icon">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
                        fill="#4E42FF"
                      />
                    </svg>
                    <input type="file" onChange={handleChange} id="file" />
                  </label>
                )}
              </SendAttachment>
              <button onClick={onSubmit}>Send</button>
            </form>
          );
        }}
      </SendMessage>
    </div>
  </Chatkit>
);

export default App;
