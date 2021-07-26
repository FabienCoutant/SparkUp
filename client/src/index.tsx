import ReactDOM from 'react-dom';
import './index.css';
import App from './Pages/App';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core';
import { getLibrary } from './utils/web3React';
import { Provider } from 'react-redux';
import store from './store/index';
import { BrowserRouter } from 'react-router-dom';

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK');

ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
