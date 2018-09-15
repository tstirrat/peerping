import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { configureFirebase } from './configureFirebase';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

configureFirebase();

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
