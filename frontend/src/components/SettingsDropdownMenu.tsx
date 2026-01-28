import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { LucideMenu, LucideLogOut, LucideSettings, LucideUser } from "lucide-react"
import {IUserTest, IFileTest} from "../App"
import { useNavigate } from "react-router-dom"
import ProfilePicDialog from "./popups/ProfilePicDialog"
import { useState } from "react"


type SettingsDropDownMenuProps = {
    userData: IUserTest,
    setUserData: (modifiedUser : IUserTest) => void,
    jwt: string | null,
    setJwt: (c: string | null) => void;
}

function SettingsDropdownMenu({userData, setUserData, jwt, setJwt}: SettingsDropDownMenuProps) {

  const navigate = useNavigate()
  const [openProfilePicDialog, setOpenProfilePicDialog] = useState<boolean>(false)

const handleLogout = () => {
        console.log("Logout clicked")

        localStorage.removeItem("token")
        localStorage.removeItem("logged_in")
        setJwt(null)

        console.log("User successfully logged out.")

        navigate("/login")
    }

    const handleProfilePic = (event: Event) => {
      event.preventDefault()
        console.log("Change profile pic button clicked")

        //ProfilePicturePopup should open
        setOpenProfilePicDialog(true)

    }

    const handleModeChange = () => {
        console.log("Mode button clicked")

        //store in browser's local storage

        //Mode should be changed:
          //Dark -> Light
          //Light -> Dark

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
          <DropdownMenuItem onSelect={(e) => handleProfilePic(e)}><LucideUser className="mr-2" /> Change profile picture</DropdownMenuItem>
          <ProfilePicDialog open={openProfilePicDialog} setOpen={setOpenProfilePicDialog}/>
          <DropdownMenuItem onClick={() => handleModeChange()}><LucideSettings className="mr-2" /> Dark mode</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleLogout()}><LucideLogOut className="mr-2" /> Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default SettingsDropdownMenu