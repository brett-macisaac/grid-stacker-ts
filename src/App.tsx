import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ThemeProvider, WindowSizeProvider } from "./standard_ui/standard_ui";

import UserProvider from "./contexts/UserContext";

import PrefProvider from "./contexts/PreferenceContext";

import Menu from './pages/menu/Menu';
import Account from './pages/account/Account';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Settings from './pages/settings/Settings';
import About from './pages/about/About';
import Controls from './pages/controls/Controls';
import SettingsThemes from './pages/settings_theme/SettingsTheme';
import GameSettings from './pages/game_settings/GameSettings';
import GuestUsername from './pages/guest_username/GuestUsername';
import Game from './pages/game/Game';
import InvalidPage from './pages/invalid_page/InvalidPage';
import SoundEffects from './pages/sound_effects/SoundEffects'; 

import './standard_ui/standard_ui.css';

function App() 
{

    return (
        <ThemeProvider>
        <WindowSizeProvider>
        <UserProvider>
        <PrefProvider>

            <Router>
                <Routes>
                    <Route
                        path = { "/" }
                        element = { <Menu /> }
                    />

                    <Route
                        path = { "/account" }
                        element = { <Account /> }
                    />

                    <Route
                        path = { "/signIn" }
                        element = { <SignIn /> }
                    />

                    <Route
                        path = { "/signUp" }
                        element = { <SignUp /> }
                    />

                    <Route
                        path = { "/settings" }
                        element = { <Settings /> }
                    />

                    <Route
                        path = { "/about" }
                        element = { <About /> }
                    />

                    <Route
                        path = { "/controls" }
                        element = { <Controls /> }
                    />

                    <Route
                        path = { "/soundEffects" }
                        element = { <SoundEffects /> }
                    />

                    <Route
                        path = { "/settingsThemes" }
                        element = { <SettingsThemes /> }
                    />


                    <Route
                        path = { "/gameSettings" }
                        element = { <GameSettings /> }
                    />

                    <Route
                        path = { "/guestUsername" }
                        element = { <GuestUsername /> }
                    />

                    <Route
                        path = { "/game" }
                        element = { <Game /> }
                    />

                    {/* 
                    * Fallback route. 
                    */}
                    <Route path = "*" element = { <InvalidPage /> } />
                </Routes>
            </Router>

        </PrefProvider>
        </UserProvider>
        </WindowSizeProvider>
        </ThemeProvider>
    );
}

export default App
