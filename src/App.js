import React from 'react';
import styles from './App.module.css';
import {
  Chatkit,
  MessageList,
  SendMessage,
  SendAttachment,
} from './chatkit-context';
import { AttachmentIcon, SendIcon, Message } from './components';

/* Here, we can use a functional component because the state we actually need is
   kept in the relevant Render Prop components. As you can see, components like
   MessageList provide access to the data, and let the user handle the rest. */

const App = () => (
  <Chatkit
    userId="ADD YOUR USER ID"
    instanceLocator="ADD YOUR INSTANCE LOCATOR"
    tokenProvider="ADD YOUR TOKEN PROVIDER URL"
  >
    <div className={styles.container}>
      <div className={styles.messageList}>
        <MessageList autoScroll>
          {({ messages, userId }) =>
            messages.map((message, index) => (
              <Message message={message} userId={userId} key={index} />
            ))
          }
        </MessageList>
      </div>
      <SendMessage>
        {({ message, onChange, onSubmit }) => {
          return (
            <form className={styles.form}>
              <input
                type="text"
                value={message}
                onChange={onChange}
                placeholder="Write something"
              />
              <SendAttachment>
                {({ handleChange }) => (
                  <label className={styles.icon}>
                    <AttachmentIcon />
                    <input type="file" onChange={handleChange} id="file" />
                  </label>
                )}
              </SendAttachment>
              <button onClick={onSubmit} className={styles.icon}>
                <SendIcon />
              </button>
            </form>
          );
        }}
      </SendMessage>
    </div>
  </Chatkit>
);

export default App;
