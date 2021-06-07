import * as React from 'react';
import Initialiser from './src/components/Initialiser'
import { Provider } from 'react-redux'
import Store from './src/reduxStore/Store.js'

function App() {

  return (
    <Provider store={Store}>
        <Initialiser />
    </Provider>
  );
}

export default App;

