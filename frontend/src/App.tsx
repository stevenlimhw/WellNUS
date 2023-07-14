import store from './state/store';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { saveState } from './state/browserStorage';

import Home from './views/pages/home/Home';
import Dashboard from './views/pages/dashboard/Dashboard';
import Login from './views/pages/authentication/Login';
import Register from './views/pages/authentication/Register';
import Profile from './views/components/profile/Profile';
import Groups from './views/pages/meet/Groups';
import Group from './views/pages/room/GroupRoom';
import JoinGroup from './views/pages/join/JoinGroup';
import Match from './views/pages/join/match/Match';

import "./global.css";
import Requests from './views/pages/requests/Requests';
import Admin from './views/pages/admin/Admin';
import Booking from './views/pages/booking/Booking';
import Events from './views/pages/events/Events';

// Ensure that redux state changes will be saved into sessionStorage.
store.subscribe(
  () => {saveState(store.getState());}
);


const App = () => {
  return (
    <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:group_id" element={<Group />} />
            <Route path="/join" element={<JoinGroup />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/events" element={<Events />} />
          </Routes>
        </BrowserRouter>
    </Provider>
  );
}

export default App;
