import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from 'react';
import {useLocation} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import CreateCampaign from "./CreateCampaign";
import CampaignDetails from "./CampaignDetails";
import UpdateCampaign from "./UpdateCampaign";
import Dashboard from "./Dashboard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Notification from "../components/Notification";
import Web3ReactManager from '../components/Web3ReactManager';
import useInitWeb3 from '../hooks/useInitWeb3';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {notificationActions} from "../store/Notification/slice";
import {NOTIFICATION_TYPE} from "../constants";

const App = () => {
    useInitWeb3();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const display = useAppSelector((state) => state.notification.display);
    const notificationType = useAppSelector((state) => state.notification.type);

    useEffect(() => {
        dispatch(notificationActions.hideNotification());
    }, [dispatch, location]);

    return (
        <>
            <Header/>
            <div className='container mb-5'>
                <Web3ReactManager>
                    <>
                        {display && <Notification/>}
                        {[(display && notificationType !== NOTIFICATION_TYPE.ERROR) || !display] && (
                            <Switch>
                                <Route path='/' exact>
                                    <Dashboard/>
                                </Route>
                                <Route path='/create' exact>
                                    <CreateCampaign/>
                                </Route>
                                <Route path='/campaign/:campaignAddress' exact>
                                    <CampaignDetails/>
                                </Route>
                                <Route
                                    path='/campaign/:campaignAddress/update'
                                    exact
                                >
                                    <UpdateCampaign/>
                                </Route>
                            </Switch>
                        )}
                    </>
                </Web3ReactManager>
            </div>
            <Footer/>
        </>
    );
};

export default App;
