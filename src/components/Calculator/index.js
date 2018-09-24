import React, { Component } from 'react';

import Button from './Button';
import Display from './Display';

const CalculatorOperations = {
  '/': (prevValue, nextValue) => prevValue / nextValue,
  '*': (prevValue, nextValue) => prevValue * nextValue,
  '+': (prevValue, nextValue) => prevValue + nextValue,
  '-': (prevValue, nextValue) => prevValue - nextValue,
  '=': (prevValue, nextValue) => nextValue
};

class Calculator extends Component {
  state = {
    value: null,
    displayValue: '0',
    operator: null,
    waitingForOperand: false
  };

  clearAll() {
    this.setState({
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false
    });
  }

  clearDisplay() {
    this.setState({
      displayValue: '0'
    });
  }

  clearLastChar() {
    const { displayValue } = this.state;

    this.setState({
      displayValue: displayValue.substring(0, displayValue.length - 1) || '0'
    });
  }

  toggleSign() {
    const { displayValue } = this.state;
    const newValue = parseFloat(displayValue) * -1;

    this.setState({
      displayValue: String(newValue)
    });
  }

  inputPercent() {
    const { displayValue } = this.state;
    const currentValue = parseFloat(displayValue);

    if (currentValue === 0) return;

    const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
    const newValue = parseFloat(displayValue) / 100;

    this.setState({
      displayValue: String(newValue.toFixed(fixedDigits.length + 2))
    });
  }

  inputDot() {
    const { displayValue } = this.state;

    if (!/\./.test(displayValue)) {
      this.setState({
        displayValue: displayValue + '.',
        waitingForOperand: false
      });
    }
  }

  inputDigit(digit) {
    const { displayValue, waitingForOperand } = this.state;

    if (waitingForOperand) {
      this.setState({
        displayValue: String(digit),
        waitingForOperand: false
      });
    } else {
      this.setState({
        displayValue:
          displayValue === '0' ? String(digit) : displayValue + digit
      });
    }
  }

  performOperation(nextOperator) {
    const { value, displayValue, operator } = this.state;
    const inputValue = parseFloat(displayValue);

    if (value == null) {
      this.setState({
        value: inputValue
      });
    } else if (operator) {
      const currentValue = value || 0;
      const newValue = CalculatorOperations[operator](currentValue, inputValue);

      this.setState({
        value: newValue,
        displayValue: String(newValue)
      });
    }

    this.setState({
      waitingForOperand: true,
      operator: nextOperator
    });
  }

  handleKeyDown = event => {
    let { key } = event;

    if (key === 'Enter') key = '=';

    if (/\d/.test(key)) {
      event.preventDefault();
      this.inputDigit(parseInt(key, 10));
    } else if (key in CalculatorOperations) {
      event.preventDefault();
      this.performOperation(key);
    } else if (key === '.') {
      event.preventDefault();
      this.inputDot();
    } else if (key === '%') {
      event.preventDefault();
      this.inputPercent();
    } else if (key === 'Backspace') {
      event.preventDefault();
      this.clearLastChar();
    } else if (key === 'Clear') {
      event.preventDefault();

      if (this.state.displayValue !== '0') {
        this.clearDisplay();
      } else {
        this.clearAll();
      }
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { displayValue } = this.state;

    const clearDisplay = displayValue !== '0';
    const clearText = clearDisplay ? 'C' : 'AC';

    return (
      <div className="calculator">
        <Display value={displayValue} />
        <div className="calculator-keypad">
          <div className="input-keys">
            <div className="function-keys">
              <Button
                className="key-clear"
                onPress={() =>
                  clearDisplay ? this.clearDisplay() : this.clearAll()
                }
              >
                {clearText}
              </Button>
              <Button className="key-sign" onPress={() => this.toggleSign()}>
                ±
              </Button>
              <Button
                className="key-percent"
                onPress={() => this.inputPercent()}
              >
                %
              </Button>
            </div>
            <div className="digit-keys">
              <Button className="key-0" onPress={() => this.inputDigit(0)}>
                0
              </Button>
              <Button className="key-dot" onPress={() => this.inputDot()}>
                ●
              </Button>
              <Button className="key-1" onPress={() => this.inputDigit(1)}>
                1
              </Button>
              <Button className="key-2" onPress={() => this.inputDigit(2)}>
                2
              </Button>
              <Button className="key-3" onPress={() => this.inputDigit(3)}>
                3
              </Button>
              <Button className="key-4" onPress={() => this.inputDigit(4)}>
                4
              </Button>
              <Button className="key-5" onPress={() => this.inputDigit(5)}>
                5
              </Button>
              <Button className="key-6" onPress={() => this.inputDigit(6)}>
                6
              </Button>
              <Button className="key-7" onPress={() => this.inputDigit(7)}>
                7
              </Button>
              <Button className="key-8" onPress={() => this.inputDigit(8)}>
                8
              </Button>
              <Button className="key-9" onPress={() => this.inputDigit(9)}>
                9
              </Button>
            </div>
          </div>
          <div className="operator-keys">
            <Button
              className="key-divide"
              onPress={() => this.performOperation('/')}
            >
              ÷
            </Button>
            <Button
              className="key-multiply"
              onPress={() => this.performOperation('*')}
            >
              ×
            </Button>
            <Button
              className="key-subtract"
              onPress={() => this.performOperation('-')}
            >
              −
            </Button>
            <Button
              className="key-add"
              onPress={() => this.performOperation('+')}
            >
              +
            </Button>
            <Button
              className="key-equals"
              onPress={() => this.performOperation('=')}
            >
              =
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Calculator;
