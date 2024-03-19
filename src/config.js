const config = {
  botName: "My Chatbot",
  lang: "en",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#376B7E",
    },
  },
  initialMessages: [
    {
      id: "welcome",
      message: "Hello! How can I assist you?",
      trigger: "start",
    },
  ],
};

export default config;
