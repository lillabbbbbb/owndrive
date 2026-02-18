import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom"
import AppleNotAvailablePopup from "../popups/AppleNotAvailablePopup";
import { useAppContext } from "../context/globalContext";
import { useTranslation } from "react-i18next";
import { THEME } from "../../theme"
import clsx from "clsx";


const Login = () => {

    const { t } = useTranslation()
    const { lightMode } = useAppContext()
    const navigate = useNavigate()
    const { login } = useAppContext()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const jwt = localStorage.getItem("token")


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log({ email, password });

        const token = await login(
            email,
            password)

        if (!token) {
            // Handle error - don't navigate!
            return;
        }
        navigate("/home")

        //display loading while localStorage.getItem("token") is not found
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
                {/* Login Form */}
                <form 
                    onSubmit={handleSubmit} 
                    className={clsx(THEME.background.card(lightMode), "p-6 sm:p-8 rounded-2xl shadow-lg w-full flex flex-col gap-4 sm:gap-6")}
                >
                    <h2 className={clsx(THEME.text.primary, "text-xl sm:text-2xl font-bold  text-center")} >
                        {t('login.log-in')}
                    </h2>

                    {/* Email input with floating label */}
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
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
                            htmlFor="name"
                            className={clsx(
                                THEME.text.secondary(lightMode), 
                                "absolute left-3 top-2.5 text-gray-400 text-xs sm:text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm sm:peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-xs sm:peer-focus:text-sm peer-focus:text-blue-500"
                            )}
                        >
                            {t("login.email")}
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
                            {t("login.password")}
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className={clsx(
                            THEME.button.highlightedPrimary(lightMode), 
                        )}
                    >
                        {t("login.log-in")}
                    </button>

                    {/* OAuth buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
                        <button
                            type="button"
                            className={clsx(
                                THEME.button.back(lightMode), 
                                "flex-1 border border-gray-300 py-2 sm:py-2.5 rounded-md transition text-sm sm:text-base"
                            )}
                            onClick={() => handleGoogleClick()}
                        >
                            Google
                        </button>
                        <AppleNotAvailablePopup />
                    </div>

                    {/* Register link */}
                    <p className={clsx(THEME.text.muted(lightMode), "text-center text-sm sm:text-base mt-2")}>
                        <Link to="/register" className="hover:underline">
                            {t("Or register here")}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login