import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { LucideMenu, LucideLogOut, LucideSettings, LucideUser } from "lucide-react"
import { IUserTest, IFileTest } from "../App"
import { useNavigate } from "react-router-dom"
import ProfilePicDialog from "./popups/ProfilePicDialog"
import { useEffect, useState } from "react"
import { useUser } from "../hooks/useUser"
import { useAppContext } from "./context/globalContext";
import CustomDialog from './popups/CustomDialog';
import { useTranslation } from "react-i18next"
import { IUserFrontend } from "../types/User"
import { toast } from "sonner"


function SettingsDropdownMenu() {

  const { t } = useTranslation()
  const navigate = useNavigate()

  const { getProfilePic, logout, getUser, userLoading, userError } = useAppContext()
  const [user, setUser] = useState<IUserFrontend | null>(null)
  const [openProfilePicDialog, setOpenProfilePicDialog] = useState<boolean>(false)
  const [profilePic, setProfilePic] = useState<string | null>(null)

  useEffect(() => {
    if (userLoading) {
      toast.warning(userLoading);
    }
    toast.warning(userError)
  }, [userError, userLoading]);

  useEffect(() => {

    console.log("User has changed")
    const loadProfilePic = async () => {
      const pic = await getProfilePic()
      console.log(pic)
      if (pic) {
        setProfilePic(`http://localhost:8000${pic.path}`)
        loadProfilePic()
      }
    }
  }, [user])

  useEffect(() => {

    console.log("User has changed")

    const loadUser = async () => {
      const fetchedUser = await getUser()
      setUser(fetchedUser)
      console.log(fetchedUser)
    }

    loadUser()
  }, [])

  const handleLogout = () => {
    logout()
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

  useEffect(() => {
    console.log(`Profile pic changed: ${profilePic}`)
  }, [user, profilePic])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={profilePic ?? undefined}
            />
            <AvatarFallback>{user?.email ? user.email[0].toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white text-black">
          <DropdownMenuItem onSelect={(e) => handleProfilePic(e)}><LucideUser className="mr-2" /> {t("settings.profile-picture")}</DropdownMenuItem>
          <ProfilePicDialog open={openProfilePicDialog} setOpen={setOpenProfilePicDialog} />
          <DropdownMenuItem onClick={() => handleModeChange()}><LucideSettings className="mr-2" /> {t("settings.dark-mode") || t("settings.light-mode")}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleLogout()}><LucideLogOut className="mr-2" /> {t("settings.log-out")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default SettingsDropdownMenu