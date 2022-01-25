import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import AppContext from './AppContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileInfo from './pages/ProfileInfo';
import OwnerHome from './pages/OwnerHome';

import {get} from './utils/api';

function App() {
  const [userData, setUserData] = React.useState({
    access_token: JSON.parse(localStorage.getItem('access_token')),
    refresh_token: JSON.parse(localStorage.getItem('refresh_token')),
    user: JSON.parse(localStorage.getItem('user'))
  });
  const updateUserData = (newUserData) => {
    setUserData(newUserData);
    localStorage.setItem('access_token', JSON.stringify(newUserData.access_token));
    localStorage.setItem('refresh_token', JSON.stringify(newUserData.refresh_token));
    localStorage.setItem('user', JSON.stringify(newUserData.user));
  }
  const logout = () => {
    updateUserData({
      access_token: null,
      refresh_token: null,
      user: null
    });
  }
  const refresh = async () => {
    const response = await get('/refresh', userData.refresh_token);
    updateUserData(response.result);
  }
  console.log(userData);
  return (
    <AppContext.Provider value={{userData, updateUserData, logout, refresh}}>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<Landing/>}/>
            <Route path='login' element={<Login/>}/>
            <Route path='signup' element={<Signup/>}/>
            <Route path='profileInfo' element={<ProfileInfo/>}/>
            <Route path='owner' element={<OwnerHome/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
