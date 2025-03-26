import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";
import GoogleSignupButton from './GoogleSignupButton';
import { Outlet, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('isSigned')) {
            navigate('/dashboard');
        }
    }, [])
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const socialEmail = useRef(false)
    const isSocial = useRef(false)
    const setSocial = () => {
        isSocial.current = true
    }
    const setSocialEmail = (value) => {
        socialEmail.current = value
    }
    const signup = async (e) => {
        if (!isSocial.current)
            e.preventDefault()
        if (!isSocial.current && (email == "" || password == "" || phoneNumber == "")) {
            toast.warning("Please input all fields")
        } else {
            try {
                let data = {
                    email: email,
                    password: password,
                    phone_number: phoneNumber
                }
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/signup`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
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
            <div className="w-[50%] max-w-full p-10 bg-white shadow-2xl rounded-xl card bg-base-100">
                <div className="flex flex-col items-stretch gap-4 text-center card-body">
                    <div className="mx-auto text-[20px] font-bold">Sign Up</div>
                    <form className="flex flex-col gap-2 form-control" onSubmit={signup}>
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
                                type="tel"
                                name="phoneNumber"
                                id="phoneNumber"
                                placeholder="Phone Number"
                                pattern="[0-9]{10}"
                                title="Please enter a 10-digit phone number"
                                required
                                onChange={(e) => setPhoneNumber(e.target.value)}
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
                            Create Account
                        </button>
                    </form>
                    <div>
                        Already have an account? <a className="text-blue-500 no-underline link text-accent" href="/signin">Sign in</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
