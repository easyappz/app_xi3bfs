import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import { Grid, Button, TextField, Paper, Typography } from '@mui/material';

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);
  const [error, setError] = useState('');

  const handleNumberClick = (value) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else if (value === '.' && display.includes('.')) {
      return;
    } else {
      setDisplay(display + value);
    }
    setWaitingForSecondValue(false);
    setError('');
  };

  const handleOperationClick = (op) => {
    if (display === '0' && !previousValue) return;

    if (previousValue && !waitingForSecondValue) {
      calculateResult(op);
    } else {
      setPreviousValue(parseFloat(display));
      setOperation(op);
      setWaitingForSecondValue(true);
      setDisplay('0');
    }
    setError('');
  };

  const calculateResult = (nextOp = null) => {
    if (!previousValue || !operation) return;

    const currentValue = parseFloat(display);
    let result = 0;

    if (operation === '+') {
      result = previousValue + currentValue;
    } else if (operation === '-') {
      result = previousValue - currentValue;
    } else if (operation === '*') {
      result = previousValue * currentValue;
    } else if (operation === '/') {
      if (currentValue === 0) {
        setError('Division by zero');
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForSecondValue(false);
        return;
      }
      result = previousValue / currentValue;
    }

    setDisplay(result.toString());
    setPreviousValue(nextOp ? result : null);
    setOperation(nextOp || null);
    setWaitingForSecondValue(!!nextOp);
    setError('');
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondValue(false);
    setError('');
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
    '='
  ];

  return (
    <ErrorBoundary>
      <div className="App">
        <Paper elevation={5} className="calculator-paper">
          <Typography variant="h6" className="calculator-title">
            Simple Calculator
          </Typography>
          {error && (
            <Typography variant="body2" color="error" className="calculator-error">
              {error}
            </Typography>
          )}
          <TextField
            variant="outlined"
            value={display}
            disabled
            fullWidth
            className="calculator-display"
            inputProps={{
              style: { textAlign: 'right', fontSize: '2rem' },
            }}
          />
          <Grid container spacing={1} className="calculator-grid">
            {buttons.map((btn) => (
              <Grid item xs={3} key={btn}>
                <Button
                  variant={btn === '=' ? 'contained' : 'outlined'}
                  color={['+', '-', '*', '/'].includes(btn) ? 'secondary' : 'primary'}
                  fullWidth
                  className="calculator-button"
                  onClick={() => {
                    if (btn === 'C') handleClear();
                    else if (btn === '=') calculateResult();
                    else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                    else handleNumberClick(btn);
                  }}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </div>
    </ErrorBoundary>
  );
}

export default App;
