import React, { Component } from 'react';
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import './App.css';

/* Here we're instantiating Context that will be used to hold the currentUser
   object provided by Chatkit. It's the Context Provider shown later that
   will ultimately provide the value; we're not passing in a default value. */

const ChatkitContext = React.createContext();

/* Here we're creating a component that will render the Context Provider, ready
   to be consumed by child components. It's here we instantiate Chatkit and store
   currentUser in state, which is then passed as the value of the Context Provider. */

class Chatkit extends Component {
  state = {
  }
  componentDidMount() {
    new ChatManager({
      instanceLocator: "ADD YOUR INSTANCE LOCATOR",
      userId: this.props.userId,
      tokenProvider: new TokenProvider({ url: "ADD YOUR TOKEN PROVIDER URL" })
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
    messages: []
  }

  componentDidMount() {
    const currentUser = this.context.currentUser;
    currentUser.subscribeToRoomMultipart({
      roomId: currentUser.rooms[0].id,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [
              ...this.state.messages,
              message
            ]
          });
        }
      }
    });
  }

  /* We're using the Render Prop pattern here so that structure and styling can be
     handled by the user. This just provides the data, and means the user will create
     a 'function as a child' to render out components that have access to the data. */

  render() {
    return this.props.children(this.state.messages);
  }
}

/* We're doing something similar here, but rather than passing in data to be consumed,
   we're passing in methods to be executed. This completely abstracts away message state
   as well as sending logic, so that users don't have to keep rewriting this stuff. */

class SendMessage extends Component {

  static contextType = ChatkitContext;

  state = {
    message: ""
  }

  componentDidMount() {
    this.setState({
      onChange: this.onChange,
      onSubmit: this.onSubmit
    })
  }

  onSubmit = event => {
    event.preventDefault();
    const currentUser = this.context.currentUser;
    currentUser.sendSimpleMessage({
      roomId: currentUser.rooms[0].id,
      text: this.state.message
    }).then(() => this.setState({
      message: ""
    }))
  }

  onChange = event => {
    this.setState({
      message: event.target.value
    })
  }

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
      <div>
        <MessageList>
          { messages => messages.map((message, index) => (
            <div key={index} className="message">
              { message.parts.map((part, index) => (
                <div key={index}>{ part.payload.content }</div>
              ))}
            </div>
          )) }
        </MessageList>
      </div>
      <SendMessage>
        { ({ message, onChange, onSubmit }) => {
          return (
            <form>
              <input type="text" value={message} placeholder="Write something" onChange={onChange} />
              <button onClick={onSubmit}>Send</button>
            </form>
          )
        }}
      </SendMessage>
    </div>
  </Chatkit>
)

export default App;