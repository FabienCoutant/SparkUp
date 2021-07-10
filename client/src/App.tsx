import Header from './components/UI/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from './components/UI/Notification';
import useInitWeb3 from './hooks/useInitWeb3';
import { useAppSelector } from './store/hooks';

function App() {
  useInitWeb3();
  const display = useAppSelector((state) => state.ui.display);

  return (
    <div>
      <Header />
      {display && <Notification />}
    </div>
  );
}

export default App;
