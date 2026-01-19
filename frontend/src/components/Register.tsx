import { useState, type FormEvent } from 'react';
import { Link } from "react-router-dom"

const Register = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log({ email, username, password });

        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })

        })

        if (response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.token)
            localStorage.setItem("is_logged_in", "true")
        }
    };

    const handleGoogleClick = () => {
        console.log("Google click")
    }

    const handleAppleClick = () => {
        console.log("Apple click")
    }
    return (<>
        <div>
            {/*
      //email
        //username
        //password
        //signup button
        //google auth button
        //icloud auth button
        //small text route to login*/}

        </div>

        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Register</h2>

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

                <div className="relative">
                    <input
                        type="text"
                        id="name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder=" "
                        className="peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                    <label
                        htmlFor="name"
                        className="absolute left-3 top-2.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
                    >
                        Username
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

                >Register
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
                <button
                    type="button"
                    className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
                    onClick={() => handleAppleClick()}
                >
                    Apple
                </button>
                <p><Link to="/login">Or log in here</Link>

                </p>
            </div>
        </div>
    </>
    )
}

export default Register
