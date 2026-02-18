import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { LucideLogOut, LucideSettings, LucideUser } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ProfilePicDialog from "./popups/ProfilePicDialog"
import { useEffect, useState } from "react"
import { useAppContext } from "./context/globalContext";
import { useTranslation } from "react-i18next"
import { IUserFrontend } from "../types/User"
import { toast } from "sonner"
import clsx from "clsx"
import { THEME } from "../theme"
import { useTheme } from "../components/context/ThemeContext"


function SettingsDropdownMenu() {

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lightMode, toggle } = useTheme()

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

    if (openProfilePicDialog) return

    const loadProfilePic = async () => {
      const pic = await getProfilePic()
      console.log(pic)
      if (pic) {
        setProfilePic(`http://localhost:8000${pic.path}`)
      }
    }
    loadProfilePic()
  }, [user, openProfilePicDialog])

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

    toggle()

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
      <div className={clsx(THEME.avatar.base, THEME.avatar.hover, THEME.avatar.hoverGlow,)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                key={profilePic}
                src={profilePic ?? undefined}
              />
              <AvatarFallback>{user?.email ? user.email[0].toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={THEME.background.card(lightMode)}>
            <DropdownMenuItem className={THEME.dropdown.item(lightMode)} onSelect={(e) => handleProfilePic(e)}><LucideUser className="mr-2" /> {t("settings.profile-picture")}</DropdownMenuItem>
            <ProfilePicDialog open={openProfilePicDialog} setOpen={setOpenProfilePicDialog} />
            <DropdownMenuItem className={THEME.dropdown.item(lightMode)} onClick={() => handleModeChange()}><LucideSettings className="mr-2" /> {lightMode ? t("settings.dark-mode") : t("settings.light-mode")}</DropdownMenuItem>
            <DropdownMenuItem className={THEME.dropdown.item(lightMode)} onClick={() => handleLogout()}><LucideLogOut className="mr-2" /> {t("settings.log-out")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

export default SettingsDropdownMenu