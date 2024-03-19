class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse = (message) => {
    this.actionProvider.handleQuery(message);
  };
}

export default MessageParser;
