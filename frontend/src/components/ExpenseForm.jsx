import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Button, Container, Grid, Box, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AuthContext } from './AuthContext';

const { user } = useContext(AuthContext);


const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  category: Yup.string().required('Category is required'),
  date: Yup.date().required('Date is required'),
  description: Yup.string(), // Optional
});

const categoryOptions = [
  'Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare',
  'Personal Care', 'Education', 'Savings', 'Other'
];

function ExpenseForm() {
  const [date, setDate] = useState(null);

  const handleSubmit = async (values) => {
    try {
        await axios.post('/api/expenses', {...values, user: user._id });

      // Optionally reset form, show success message, etc.
    } catch (error) {
      console.error('Error adding expense:', error);
      // Handle error (show error message)
    }
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  return (
    <Container maxWidth="sm">
      <h2>Add Expense</h2>
      <Formik
        initialValues={{ amount: '', category: '', date: null, description: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                name="amount"
                as={TextField}
                label="Amount"
                type="number"
                fullWidth
                error={!!<ErrorMessage name="amount" />}
                helperText={<ErrorMessage name="amount" />}
              />
            </Grid>
            <Grid item xs={12}>
              <Field 
                name="category" 
                as={TextField}
                label="Category" 
                select 
                fullWidth
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Field>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date"
                  inputFormat="MM/DD/YYYY"
                  value={date}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <Field
                      name="date"
                      {...params}
                      as={TextField}
                      fullWidth
                      error={!!<ErrorMessage name="date" />}
                      helperText={<ErrorMessage name="date" />}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Field
                name="description"
                as={TextField}
                label="Description (Optional)"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" variant="contained" color="primary">
                  Add Expense
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Container>
  );
}

export default ExpenseForm;
