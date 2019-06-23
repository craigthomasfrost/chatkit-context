import React from 'react';
import styles from './index.module.css';
import { Image } from '../index';

const Message = props => {
  const { message, userId } = props;
  const ownMsg = message.senderId === userId;
  return (
    <div className={`${styles.msg} ${ownMsg ? styles.msgOwn : null}`}>
      {message.parts.map((part, index) => {
        if (part.payload.type.includes('image')) {
          return <Image payload={part.payload} key={index} />;
        }
        return (
          <div key={index} className={styles.msgTxt}>
            {part.payload.content}
          </div>
        );
      })}
    </div>
  );
};

export default Message;
