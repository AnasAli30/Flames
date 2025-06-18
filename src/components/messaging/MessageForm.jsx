import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Feedback,
  SrOnly
} from '../../styles/StyledComponents';

const MessageForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    toCode: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ toCode: '', message: '' }); // Clear form after submit
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={handleSubmit} style={{ marginTop: '1em', marginBottom: '1em' }}>
      <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
        <div style={{ flex: '1' }}>
          <SrOnly>Recipient Code</SrOnly>
          <Input
            type="text"
            id="to-code"
            name="toCode"
            placeholder="Recipient Code"
            value={formData.toCode}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: '2' }}>
          <SrOnly>Message</SrOnly>
          <Input
            type="text"
            id="message"
            name="message"
            placeholder="Type your message..."
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit">Send</Button>
      </div>
      {error && <Feedback isError>{error}</Feedback>}
    </Form>
  );
};

export default MessageForm; 