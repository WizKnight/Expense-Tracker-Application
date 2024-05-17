import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Grid, Box } from '@mui/material';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post('/api/auth/login', values);
      localStorage.setItem('token', res.data.token);
      setSubmitting(false);
      navigate('/');  // Redirect to the expense list after successful login
    } catch (err) {
      setLoginError(err.response?.data?.errors[0]?.msg || 'Login failed');
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <Formik
        initialValues={{ username: '', password: '' }}
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
              {loginError && (
                <Grid item xs={12}>
                  <Typography color="error">{loginError}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    Login
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

export default Login;
