import { useEffect, useState, type FormEvent } from "react";
import React from 'react'
import {Link, useNavigate} from "react-router-dom"
import AppleNotAvailablePopup from "./popups/AppleNotAvailablePopup";

type LoginProps = {
    jwt: string | null,
    setJwt: (c: string | null) => void;
}

const Login = ({jwt, setJwt} : LoginProps) => {

    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log({ email, password });

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            })

        })

        if (response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.token)
            setJwt(localStorage.getItem("token"))


            navigate("/home")

            //display loading while localStorage.getItem("token") is not found

        }else{
            console.log("Login failed.")
        }
    };

    const handleGoogleClick = () => {
        console.log("Google click")
    }

    const handleAppleClick = () => {
        console.log("Apple click")
    }

    return (
        <div>
             {/*
            Login
            //email
            //password
            //login button
            //google auth button
            //icloud auth button
            //small text route to registration*/}

            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Log in</h2>

                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder=" "
                            className="peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                        <label
                            htmlFor="name"
                            className="absolute left-3 top-2.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                            Email
                        </label>
                    </div>

                    {/* Password input with floating label */}
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder=" "
                            className="peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-3 top-2.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                            Password
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition"
                        
                    >Log in
                    </button>
                </form>

                {/* Additional buttons outside of the form*/}
                    <div className="flex justify-between gap-2">
                        <button
                            type="button"
                            className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
                            onClick={() => handleGoogleClick()}
                        >
                            Google
                        </button>
                        <AppleNotAvailablePopup />
                        
                        <p><Link to="/register">Or register here</Link>
                            
                        </p>
                    </div>
            </div>
        </div>
    )
}

export default Login
