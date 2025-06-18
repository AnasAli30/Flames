import {
  MessagesList,
  Message
} from '../../styles/StyledComponents';

const MessageList = ({ messages }) => {
  return (
    <MessagesList>
      {messages.map((msg, index) => (
        <Message key={`${msg.from}-${msg.timestamp}-${index}`}>
          <div>From: {msg.from}</div>
          <div>Message: {msg.encryptedMessage}</div>
          <div>Time: {new Date(msg.timestamp).toLocaleString()}</div>
        </Message>
      ))}
      {messages.length === 0 && (
        <Message>No messages yet.</Message>
      )}
    </MessagesList>
  );
};

export default MessageList; 