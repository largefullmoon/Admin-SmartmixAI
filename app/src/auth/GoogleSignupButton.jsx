import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';

const GoogleSignupButton = ({ setEmail, setSocial, signup}) => {
    const register = useGoogleLogin({
        onSuccess: async (response) => {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${response.access_token}`,
                },
            });
            const userInfo = await res.json();
            setEmail(userInfo.email)
            setSocial(true)
            setTimeout(() => {
                signup()
            }, 1000);
        },
        onError: (error) => {
            console.log('Login Failed:', error);
        },
        flow: 'implicit', // For implicit flow
    });

    return (
        <button onClick={register} className="flex items-center justify-center w-full gap-2 p-2 border border-blue-400 rounded-xl btn btn-outline btn-primary hover:bg-blue-400 hover:text-white">
            <FcGoogle size={25} />
            Sign up with Google
        </button>
    );
};

export default GoogleSignupButton;