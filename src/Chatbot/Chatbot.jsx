import React from 'react';
import { Chatbot } from 'react-chatbot-kit';
import config from './config';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';

function Chatbot() {
  return (
    <Chatbot
      config={config}
      actionProvider={ActionProvider}
      messageParser={MessageParser}
    />
  );
}

export default Chatbot;
