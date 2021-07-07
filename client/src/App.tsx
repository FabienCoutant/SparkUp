import React from 'react';
import { useEagerConnect, useInactiveListener } from './hooks/web3';
import Header from './components/UI/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  return (
    <div>
      <Header />
    </div>
  );
}

export default App;
