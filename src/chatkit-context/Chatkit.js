import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { ChatkitContext } from '.';

/* Here we're creating a component that will render the Context Provider, ready
   to be consumed by child components. It's here we instantiate Chatkit and store
   currentUser in state, which is then passed as the value of the Context Provider. */

class Chatkit extends Component {
  state = {};

  componentDidMount() {
    new ChatManager({
      instanceLocator: this.props.instanceLocator,
      userId: this.props.userId,
      tokenProvider: new TokenProvider({
        url: this.props.tokenProvider,
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

export default Chatkit;
