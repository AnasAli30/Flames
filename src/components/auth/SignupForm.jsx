import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Feedback,
  SrOnly
} from '../../styles/StyledComponents';

const SignupForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // Handle password mismatch error
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <SrOnly>Email</SrOnly>
        <Input
          type="email"
          id="signup-email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
      </div>
      <div>
        <SrOnly>Phone</SrOnly>
        <Input
          type="tel"
          id="signup-phone"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          autoComplete="tel"
        />
      </div>
      <div>
        <SrOnly>Password</SrOnly>
        <Input
          type="password"
          id="signup-password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
      </div>
      <div>
        <SrOnly>Confirm Password</SrOnly>
        <Input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
      </div>
      <Button type="submit">Sign Up</Button>
      {error && <Feedback isError>{error}</Feedback>}
    </Form>
  );
};

export default SignupForm; 