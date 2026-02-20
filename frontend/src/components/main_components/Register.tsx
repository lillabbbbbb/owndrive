import { useState, type FormEvent } from 'react';
import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import { THEME } from "../../theme"
import AppleNotAvailablePopup from '../popups/AppleNotAvailablePopup';
import clsx from 'clsx';
import { useAppContext } from '../context/globalContext';

const Register = () => {

    //import variables and functions from hooks
    const { t } = useTranslation()
    const { lightMode } = useAppContext()

    //States
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Handle registration form submission
    const handleSubmit = async (e: FormEvent) => {
        //Prvent default page reload
        e.preventDefault();
        console.log({ email, username, password });

        //call API endpoint directly. Honestly I made this at the very beginning and haven't refactored, but this should be happening through a hook for consistency
        const response = await fetch("/api/auth/register", {
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

        //
        if (response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.token)
        }
    };

    const handleGoogleClick = () => {
        console.log("Google click")
    }

    const handleAppleClick = () => {
        console.log("Apple click")
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-8">
            <div className="w-full max-w-md">
                {/* Register Form */}
                <form 
                    onSubmit={handleSubmit} 
                    className={clsx(THEME.background.card(lightMode), "p-6 sm:p-8 rounded-2xl shadow-lg w-full flex flex-col gap-4 sm:gap-6")}
                >
                    <h2 className={clsx(THEME.text.primary, "text-xl sm:text-2xl font-boldtext-center")} >
                        {t("register.register")}
                    </h2>

                    {/* Email input with floating label */}
                    <div className="relative">
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder=" "
                            className={clsx(
                                THEME.input.field(lightMode), 
                                "peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none text-sm sm:text-base"
                            )}
                        />
                        <label
                            htmlFor="email"
                            className={clsx(
                                THEME.text.secondary(lightMode), 
                                "absolute left-3 top-2.5 text-gray-400 text-xs sm:text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm sm:peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-xs sm:peer-focus:text-sm peer-focus:text-blue-500"
                            )}
                        >
                            {t("register.email")}
                        </label>
                    </div>

                    {/* Username input with floating label */}
                    <div className="relative">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder=" "
                            className={clsx(
                                THEME.input.field(lightMode), 
                                "peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none text-sm sm:text-base"
                            )}
                        />
                        <label
                            htmlFor="username"
                            className={clsx(
                                THEME.text.secondary(lightMode), 
                                "absolute left-3 top-2.5 text-gray-400 text-xs sm:text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm sm:peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-xs sm:peer-focus:text-sm peer-focus:text-blue-500"
                            )}
                        >
                            {t("register.username")}
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
                            className={clsx(
                                THEME.input.field(lightMode), 
                                "peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none text-sm sm:text-base"
                            )}
                        />
                        <label
                            htmlFor="password"
                            className={clsx(
                                THEME.text.secondary(lightMode), 
                                "absolute left-3 top-2.5 text-gray-400 text-xs sm:text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm sm:peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-xs sm:peer-focus:text-sm peer-focus:text-blue-500"
                            )}
                        >
                            {t("register.password")}
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className={clsx(
                            THEME.button.highlightedPrimary(lightMode), 
                            )}
                    >
                        {t("register.register")}
                    </button>

                    {/* OAuth buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
                        <button
                            type="button"
                            className={clsx(
                                THEME.button.back(lightMode), 
                                "flex-1 border py-2 sm:py-2.5 rounded-md transition text-sm sm:text-base"
                            )}
                            onClick={() => handleGoogleClick()}
                        >
                            Google
                        </button>
                        
                        <AppleNotAvailablePopup />
                    </div>

                    {/* Login link */}
                    <p className={clsx(THEME.text.muted(lightMode), "text-center text-sm sm:text-base mt-2")}>
                        <Link to="/login" className="hover:underline">
                            {t("register.or-login-here")}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register