import Header from './components/UI/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from './components/UI/Notification';
import useInitWeb3 from './hooks/useInitWeb3';
import { useAppSelector, useAppDispatch } from './store/hooks';
import CreateCampaign from './components/Campaigns/CreateCampaign';
import { Route, Switch } from 'react-router-dom';
import Web3ReactManager from './components/Web3ReactManager/Web3ReactManager';
import CreateRewards from './components/Campaigns/CreateRewards';
import ConfirmCampaign from './components/Campaigns/ConfirmCampaign';
import Dashboard from './components/UI/Dashboard';
import Footer from './components/UI/Footer';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { uiActions } from './store/ui-slice';

const App = () => {
  useInitWeb3();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const display = useAppSelector((state) => state.ui.display);
  useEffect(() => {
    dispatch(uiActions.hideNotification());
  }, [dispatch, location]);

  return (
    <>
      <Header />
      <div className='container mb-5'>
        <Web3ReactManager>
          <>
            {display && <Notification />}
            {!display && (
              <Switch>
                <Route path='/createcampaign' exact>
                  <CreateCampaign showNextButton={true} />
                </Route>
                <Route path='/createcampaign/rewards' exact>
                  <CreateRewards />
                </Route>
                <Route path='/createcampaign/confirm' exact>
                  <ConfirmCampaign />
                </Route>
                <Route path='/' exact>
                  <Dashboard />
                </Route>
              </Switch>
            )}
          </>
        </Web3ReactManager>
      </div>
      <Footer />
    </>
  );
};

export default App;
