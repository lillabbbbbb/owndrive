import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { LucideMenu, LucideLogOut, LucideSettings, LucideUser } from "lucide-react"
import {IUserTest, IFileTest} from "../App"
import { useNavigate } from "react-router-dom"


type SettingsDropDownMenuProps = {
    userData: IUserTest,
    setUserData: (modifiedUser : IUserTest) => void,
    jwt: string | null,
    setJwt: (c: string | null) => void;
}

function SettingsDropdownMenu({userData, setUserData, jwt, setJwt}: SettingsDropDownMenuProps) {

  const navigate = useNavigate()

const handleLogout = () => {
        console.log("Logout clicked")

        localStorage.removeItem("token")
        localStorage.removeItem("logged_in")
        setJwt(null)

        console.log("User successfully logged out.")

        navigate("/login")
    }

    const handleProfilePic = () => {
        console.log("Change profile pic button clicked")

    }

    const handleModeChange = () => {
        console.log("Mode button clicked")

    }

  return (
<>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://i.pravatar.cc/150?img=1" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white text-black">
          <DropdownMenuItem onClick={() => handleProfilePic()}><LucideUser className="mr-2" /> Change profile picture</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleModeChange()}><LucideSettings className="mr-2" /> Dark mode</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleLogout()}><LucideLogOut className="mr-2" /> Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default SettingsDropdownMenu