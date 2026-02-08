import { Link, useNavigate } from "react-router-dom"

import { Button } from "../ui/button"
import { LucideMenu, LucideLogOut, LucideSettings, LucideUser } from "lucide-react"

import { Input } from "../ui/input"
import { IFile } from "../../../../server/src/models/File"
import { IUser } from "../../../../server/src/models/User"
import { IUserTest, IFileTest } from "../../App"
import SettingsDropdownMenu from "../SettingsDropdownMenu"
import LanguageDropdown from "../LanguageDropdown"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

const Header = () => {


    const { t } = useTranslation()
    const navigate = useNavigate()
    const jwt = localStorage.getItem("token")

    useEffect(() => {
        console.log("jwt changed")
    }, [jwt])

    const handleHomeClick = () => {
        console.log("Home button clicked")
        navigate("/home")
    }

    return (
        <header className="flex items-center justify-between fixed top-0 left-0 w-full z-50 p-4 bg-linear-to-r from-indigo-600 to-black-600 shadow-lg text-white">
            {/* Left: Logo / Menu */}
            <div className="flex items-center gap-4">
                <span className="text-2xl font-bold tracking-tight">OwnDrive</span>
            </div>

            {/* Center: Navigation + Search */}
            <div className=" md:flex items-center gap-6">
                <nav className="flex gap-4">
                    {!jwt &&
                        <button><Link to="/login">{t("login.log-in")}</Link></button>
                    }
                    {jwt &&
                        <>
                            <button onClick={() => handleHomeClick()}>{t("home.home")}</button>
                        </>

                    }
                </nav>
            </div>

            {/* Right */}
            <div className="flex items-center justify-between gap-6">
                <LanguageDropdown />
                {jwt && <SettingsDropdownMenu />}

            </div>
        </header>
    )
}

export default Header
