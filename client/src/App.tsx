import Header from './components/UI/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from './components/UI/Notification';
import useInitWeb3 from './hooks/useInitWeb3';
import { useAppSelector } from './store/hooks';
import CreateCampaign from './components/Campaigns/CreateCampaign';
import { Route, Switch } from 'react-router-dom';
import Web3ReactManager from './components/Web3ReactManager/Web3ReactManager';
import CreateRewards from './components/Campaigns/CreateRewards';
import ConfirmCampaign from './components/Campaigns/ConfirmCampaign';
function App() {
  useInitWeb3();
  const display = useAppSelector((state) => state.ui.display);

  return (
    <>
      <Header />
      <div className='container'>
        <Web3ReactManager>
          <>
            {display && <Notification />}
            <Switch>
              <Route path='/createcampaign' exact>
                <CreateCampaign />
              </Route>
              <Route path='/createcampaign/rewards' exact>
                <CreateRewards />
              </Route>
              <Route path='/createcampaign/confirm' exact>
                <ConfirmCampaign />
              </Route>
            </Switch>
          </>
        </Web3ReactManager>
      </div>
    </>
  );
}

export default App;
