import 'normalize.css';
// tslint:disable-next-line:ordered-imports
import 'material-components-web/dist/material-components-web.css';
import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './App';
import { configureFirebase } from './configureFirebase';
import registerServiceWorker from './registerServiceWorker';

configureFirebase();

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
