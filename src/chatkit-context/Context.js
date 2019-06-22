import React from 'react';

/* Here we're instantiating Context that will be used to hold the currentUser
   object provided by Chatkit. It's the Context Provider shown later that
   will ultimately provide the value; we're not passing in a default value. */

const ChatkitContext = React.createContext();

export default ChatkitContext;
