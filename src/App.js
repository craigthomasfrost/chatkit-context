import React from 'react';
import styles from './App.module.css';
import {
  Chatkit,
  MessageList,
  SendMessage,
  SendAttachment,
} from './chatkit-context';

/* Here, we can use a functional component because the state we actually need is
   kept in the relevant Render Prop components. As you can see, components like
   MessageList provide access to the data, and let the user handle the rest. */

const App = () => (
  <Chatkit userId="ADD YOUR USER ID">
    <div className={styles.container}>
      <div className={styles.messageList}>
        <MessageList autoScroll>
          {({ messages, userId }) =>
            messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  userId === message.sender.id ? styles.messageOwn : null
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
                    <div key={index} className={styles.messageText}>
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
