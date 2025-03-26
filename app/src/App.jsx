import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './auth/Signup';
import SignIn from './auth/SingIn';
import { AuthProvider } from './AuthContext';
import NotFound from './Notfound';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import AdminContainer from './Admin';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <Router>
            <ToastContainer />
            <Routes>
              <Route path="/" element={<AdminContainer />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
