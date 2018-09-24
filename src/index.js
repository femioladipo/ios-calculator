import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/Calculator';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('app'));
registerServiceWorker();
