import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import SettingsDropdownMenu from "../SettingsDropdownMenu"
import LanguageDropdown from "../LanguageDropdown"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { useAppContext } from "../context/globalContext"
import { THEME } from "../../theme"

const Header = () => {


    const { t } = useTranslation()
    const { lightMode } = useAppContext()
    const navigate = useNavigate()
    const jwt = localStorage.getItem("token")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        console.log("jwt changed")
    }, [jwt])

    const handleHomeClick = () => {
        console.log("Home button clicked")
        navigate("/home")
    }

    return (
        <nav
            className={clsx(
                "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md transition-colors duration-300",
                THEME.responsive.main)}
        >
            {/* Left: Logo */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={handleHomeClick}>
                <span className={clsx(THEME.text.logo(lightMode), "text-2xl font-bold tracking-tight")}>
                    OwnDrive
                </span>
            </div>

            {/* Center: Navigation */}
            <div className="md:flex items-center gap-6">
                <nav className="flex gap-4">
                    {!jwt && (
                        <Button className={clsx(THEME.button.secondary(lightMode))}>
                            <Link to="/login">{t("login.log-in")}</Link>
                        </Button>
                    )}
                </nav>
            </div>

            {/* Right: Language & Settings */}
            <div className="flex items-center gap-4">
                <LanguageDropdown />
                {jwt && <SettingsDropdownMenu />}
            </div>
        </nav>
    )
}

export default Header
