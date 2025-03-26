import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";
import GoogleLoginButton from './GoogleLoginButton';

const SignIn = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('isSigned')) {
            navigate('/dashboard');
        }
    }, [])
    const [email, setEmail] = useState("")
    const socialEmail = useRef(false)
    const [password, setPassword] = useState("")
    const isSocial = useRef(false)
    const setSocial = () => {
        isSocial.current = true
    }
    const setSocialEmail = (value) => {
        socialEmail.current = value
    }
    const token = useRef(null);
    const signin = async (e) => {
        if (!isSocial.current)
            e.preventDefault()
        if (!isSocial.current && (email == "" || password == "")) {
            toast.warning("please input all field")
        } else {
            try {
                let data = {
                    email: email,
                    password: password,
                    isSocial: isSocial.current
                }
                if (isSocial.current) {
                    data = {
                        email: socialEmail.current,
                        password: password,
                        isSocial: isSocial.current
                    }
                }
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/signin`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    token.current = response.data.token
                    toast.success(response.data.message)
                    await localStorage.setItem('token', response.data.token);
                    await localStorage.setItem('user_id', response.data.user_id);
                    await localStorage.setItem('isSigned', true);
                    navigate('/dashboard');
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                toast.error(error.response.data.detail)
            }
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-[50%] max-w-full p-10 bg-white shadow-2xl rounded-2xl">
                <div className="flex flex-col items-stretch gap-4 text-center card-body">
                    <div className="mx-auto text-[20px] font-bold">Sign in</div>
                    <form className="flex flex-col gap-2 form-control" onSubmit={signin}>
                        <div>
                            <input
                                className="w-full p-3 border border-gray-300 rounded-full input input-bordered"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                autoComplete="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                className="w-full p-3 border border-gray-300 rounded-full input input-bordered"
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                required
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full p-4 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                            <span className="invisible"></span>
                            Sign in
                        </button>
                    </form>
                    <div className="mt-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-full h-[1px] bg-gray-300"></div>
                            <div className="text-gray-500 whitespace-nowrap">or continue with</div>
                            <div className="w-full h-[1px] bg-gray-300"></div>
                        </div>
                        <GoogleLoginButton setEmail={setSocialEmail} setSocial={setSocial} signin={signin} />
                    </div>
                    <div>
                        <a href="/signup" className="block mt-4 text-blue-500 no-underline link text-accent text-[16px]">
                            Create an account
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
