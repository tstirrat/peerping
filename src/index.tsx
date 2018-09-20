import 'normalize.css';
// tslint:disable-next-line:ordered-imports
import 'material-components-web/dist/material-components-web.css';
import './index.css';

import Symbol_observable from 'symbol-observable';
// tslint:disable-next-line:ordered-imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import setObservableConfig from 'recompose/setObservableConfig';
import { from } from 'rxjs';

import { App } from './App';
import { configureFirebase } from './configureFirebase';
import registerServiceWorker from './registerServiceWorker';

// tslint:disable-next-line:no-unused-expression need this imported
Symbol_observable;

setObservableConfig({
  fromESObservable: from as any
});

configureFirebase();

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
