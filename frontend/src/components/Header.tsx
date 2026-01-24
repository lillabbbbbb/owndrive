import { Link, useNavigate } from "react-router-dom"

import { Button } from "../components/ui/button"
import { LucideMenu, LucideLogOut, LucideSettings, LucideUser } from "lucide-react"

import { Input } from "../components/ui/input"
import { IFile } from "../../../server/src/models/File"
import { IUser } from "../../../server/src/models/User"
import { IUserTest, IFileTest } from "../App"
import SettingsDropdownMenu from "./SettingsDropdownMenu"

type HeaderProps = {
    userData: IUserTest,
    setUserData: (modifiedUser: IUserTest) => void,
    jwt: string | null,
    setJwt: (c: string | null) => void;
}


const Header = ({ userData, setUserData, jwt, setJwt }: HeaderProps) => {

    const navigate = useNavigate()

    const handleLogout = () => {
        console.log("Logout clicked")

        localStorage.removeItem("token")
        localStorage.removeItem("logged_in")
        setJwt(null)

        console.log("User successfully logged out.")

        navigate("/login")
    }

    const handleHomeClick = () => {
        console.log("Home button clicked")
        navigate("/home")
    }

    return (
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg text-white">
            {/* Left: Logo / Menu */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2 rounded-full md:hidden">
                    <LucideMenu size={20} />
                </Button>
                <span className="text-2xl font-bold tracking-tight">MyApp</span>
            </div>

            {/* Center: Navigation + Search */}
            <div className="hidden md:flex items-center gap-6">
                <nav className="flex gap-4">
                    <Button variant="ghost" className="text-white hover:bg-white/20">Home</Button>
                    <Button variant="ghost" className="text-white hover:bg-white/20">Files</Button>
                    <Button variant="ghost" className="text-white hover:bg-white/20">Projects</Button>
                    {!jwt &&
                    <button><Link to="/login">Login</Link></button>
                }
                {jwt &&
                    <>
                        <button onClick={() => handleHomeClick()}>Home</button>
                        <button onClick={() => handleLogout()}>Logout</button>

                    </>

                }
                </nav>
                <Input
                    placeholder="Search files..."
                    className="bg-white/20 placeholder-white text-white border-none focus:ring-2 focus:ring-white rounded-full px-4 py-1"
                />
            </div>

            {/* Right: User avatar + dropdown */}
            <SettingsDropdownMenu />
        </header>
    )
}

export default Header
