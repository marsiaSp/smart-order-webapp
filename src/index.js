import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//Κάνει render το app component στο root του html
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
