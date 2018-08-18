import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <App host='http://localhost:9200/goodbooks10k/books/_search' />, 
    document.getElementById('root')
);

registerServiceWorker();
