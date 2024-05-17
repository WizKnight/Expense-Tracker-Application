import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Container, CircularProgress, Grid, Typography
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { AuthContext } from './AuthContext';

const { user } = useContext(AuthContext);

setExpenses(res.data.filter(e=> e.user===user._id));


function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/api/expenses');
        setExpenses(res.data);
      } catch (err) {
        setError(err.message || 'Error fetching expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleEdit = (expenseId) => {
    // TODO: Implement logic to navigate to edit page with expenseId
    console.log('Edit expense:', expenseId);
  };

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`/api/expenses/${expenseId}`);
      setExpenses(expenses.filter(e => e._id !== expenseId));
    } catch (err) {
      console.error('Error deleting expense:', err);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <Container maxWidth="md">
      <h2>Expense List</h2>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell></TableCell> {/* For edit/delete buttons */}
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(expense._id)}>Edit</Button>
                    <Button onClick={() => handleDelete(expense._id)} color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );

const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Prepare data for the chart
    const expensesByCategory = {};
    expenses.forEach((expense) => {
      expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    setChartData(Object.entries(expensesByCategory).map(([category, value]) => ({
      name: category,
      value,
    })));
  }, [expenses]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="md">
      {/* ... (existing code for expense list table) */}

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Spending by Category
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        {/* You can add more charts here for other visualizations */}
      </Grid>
    </Container>
  );
}

export default ExpenseList;
