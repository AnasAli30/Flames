import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Feedback,
  SrOnly
} from '../../styles/StyledComponents';

const LoginForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    code: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <SrOnly>Code</SrOnly>
        <Input
          type="text"
          id="login-code"
          name="code"
          placeholder="Code"
          value={formData.code}
          onChange={handleChange}
          required
          autoComplete="username"
        />
      </div>
      <div>
        <SrOnly>Password</SrOnly>
        <Input
          type="password"
          id="login-password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
      </div>
      <Button type="submit">Log In</Button>
      {error && <Feedback isError>{error}</Feedback>}
    </Form>
  );
};

export default LoginForm; 