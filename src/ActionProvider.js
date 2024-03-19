import axios from "axios";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  async handleQuery(query) {
    try {
      const response = await axios.get(`https://api.example.com/?q=${query}`);
      const { data } = response;
      const message = this.createChatBotMessage(data.answer);
      this.addMessageToState(message);
    } catch (error) {
      console.error(error);
    }
  }

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider;
