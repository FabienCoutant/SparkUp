import useEagerConnect from './hooks/useEagerConnect';
import useInactiveListener from './hooks/useInactiveListener';
import Header from './components/UI/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3ReactManager from './components/Web3/Web3ReactManager';

function App() {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  return (
    <div>
      <Header />
      <Web3ReactManager />
    </div>
  );
}

export default App;
