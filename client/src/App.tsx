import React from 'react';
import { useEagerConnect, useInactiveListener } from './hooks/web3';

function App() {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  return <div></div>;
}

export default App;
