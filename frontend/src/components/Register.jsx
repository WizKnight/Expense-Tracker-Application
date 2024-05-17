import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Box 
} from '@mui/material';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

function Register() {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post('/api/auth/register', values);
      localStorage.setItem('token', res.data.token);
      setSubmitting(false);
      navigate('/');  // Redirect to the expense list after successful registration
    } catch (err) {
      setRegisterError(err.response?.data?.errors[0]?.msg || 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="username"
                  label="Username"
                  fullWidth
                  error={!!<ErrorMessage name="username" />}
                  helperText={<ErrorMessage name="username" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  error={!!<ErrorMessage name="password" />}
                  helperText={<ErrorMessage name="password" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  error={!!<ErrorMessage name="confirmPassword" />}
                  helperText={<ErrorMessage name="confirmPassword" />}
                />
              </Grid>
              {registerError && (
                <Grid item xs={12}>
                  <Typography color="error">{registerError}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    Register
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default Register;
