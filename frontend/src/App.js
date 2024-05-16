import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/api/expenses');
        setExpenses(res.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        // Handle the error (e.g., display an error message)
      }
    };

    fetchExpenses();
  }, []);

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Expense Tracker
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/add">Add Expense</Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ mt: 3 }}>
          <Routes>
            <Route path="/" element={<ExpenseList expenses={expenses} />} />
            <Route path="/add" element={<ExpenseForm />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
