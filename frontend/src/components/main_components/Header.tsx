import { Link, useNavigate } from "react-router-dom"

import { Button } from "../ui/button"
import { LucideMenu, LucideLogOut, LucideSettings, LucideUser } from "lucide-react"

import { Input } from "../ui/input"
import { IFile } from "../../../../server/src/models/File"
import { IUser } from "../../../../server/src/models/User"
import { IUserTest, IFileTest } from "../../App"
import SettingsDropdownMenu from "../SettingsDropdownMenu"

type HeaderProps = {
    userData: IUserTest,
    setUserData: (modifiedUser: IUserTest) => void,
    jwt: string | null,
    setJwt: (c: string | null) => void;
}


const Header = ({ userData, setUserData, jwt, setJwt }: HeaderProps) => {

    const navigate = useNavigate()

    const handleHomeClick = () => {
        console.log("Home button clicked")
        navigate("/home")
    }

    return (
        <header className="flex items-center justify-between fixed top-0 left-0 w-full z-50 p-4 bg-gradient-to-r from-indigo-600 to-black-600 shadow-lg text-white">
            {/* Left: Logo / Menu */}
            <div className="flex items-center gap-4">
                <span className="text-2xl font-bold tracking-tight">MyApp</span>
            </div>

            {/* Center: Navigation + Search */}
            <div className=" md:flex items-center gap-6">
                <nav className="flex gap-4">
                    {!jwt &&
                    <button><Link to="/login">Login</Link></button>
                }
                {jwt &&
                    <>
                        <button onClick={() => handleHomeClick()}>Home</button>
                    </>

                }
                </nav>
            </div>

            {/* Right: User avatar + dropdown */}
            {jwt && <SettingsDropdownMenu userData={userData} setUserData={setUserData} jwt={jwt} setJwt={(c) => setJwt(c)} />}
            
        </header>
    )
}

export default Header
