import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import ConfirmCampaign from './components/Campaigns/Creation/ConfirmCampaign';
import CreateCampaign from './components/Campaigns/Creation/CreateCampaign';
import CreateRewards from './components/Campaigns/Creation/CreateRewards';
import CampaignDetails from './components/Campaigns/Existing/CampaignDetails';
import UpdateCampaign from './components/Campaigns/Existing/UpdateCampaign';
import UpdateReward from './components/Campaigns/Existing/UpdateReward';
import Dashboard from './components/UI/Dashboard';
import Footer from './components/UI/Footer';
import Header from './components/UI/Header';
import Notification from './components/UI/Notification';
import Web3ReactManager from './components/Web3ReactManager/Web3ReactManager';
import useInitWeb3 from './hooks/useInitWeb3';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { uiActions } from './store/ui-slice';

const App = () => {
  useInitWeb3();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const display = useAppSelector((state) => state.ui.display);
  const notificationType = useAppSelector((state) => state.ui.type);

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
            {[(display && notificationType !== 'error') || !display] && (
              <Switch>
                <Route path='/' exact>
                  <Dashboard />
                </Route>
                <Route path='/createcampaign' exact>
                  <CreateCampaign showNextButton={true} />
                </Route>
                <Route path='/createcampaign/rewards' exact>
                  <CreateRewards />
                </Route>
                <Route path='/createcampaign/confirm' exact>
                  <ConfirmCampaign />
                </Route>
                <Route path='/campaign-details/:campaignAddress' exact>
                  <CampaignDetails />
                </Route>
                <Route
                  path='/campaign-details/:campaignAddress/updateReward/:rewardId'
                  exact
                >
                  <UpdateReward rewardId={null} />
                </Route>
                <Route
                  path='/campaign-details/:campaignAddress/updateCampaign'
                  exact
                >
                  <UpdateCampaign />
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
