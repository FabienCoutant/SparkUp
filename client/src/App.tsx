import Header from './components/UI/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from './components/UI/Notification';
import useInitWeb3 from './hooks/useInitWeb3';
import { useAppSelector } from './store/hooks';
import CreateCampaign from './components/Campaigns/CreateCampaign';
import { Route } from 'react-router-dom';

function App() {
  useInitWeb3();
  const display = useAppSelector((state) => state.ui.display);

  return (
    <>
      <Header />
      <div className='container'>
        {display && <Notification />}
        <Route path='/createcampaign'>
          <CreateCampaign />
        </Route>
      </div>
    </>
  );
}

export default App;
