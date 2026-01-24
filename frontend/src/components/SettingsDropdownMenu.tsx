import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { LucideMenu, LucideLogOut, LucideSettings, LucideUser } from "lucide-react"


function SettingsDropdownMenu() {
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
              <DropdownMenuItem><LucideUser className="mr-2" /> Profile</DropdownMenuItem>
              <DropdownMenuItem><LucideSettings className="mr-2" /> Settings</DropdownMenuItem>
              <DropdownMenuItem><LucideLogOut className="mr-2" /> Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
    </>
  )
}

export default SettingsDropdownMenu