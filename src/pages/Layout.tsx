import { Link, Outlet } from "react-router-dom"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast, Toaster } from "sonner"
import { useEffect } from "react"
import api from "@/utils/axios"
import useUserStore from "@/store/userStore"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Cookies from "js-cookie"

function Layout() {
    // user, setUser implements from zustand store
    const setUser = useUserStore((state) => state.setUser)
    const clearUser = useUserStore((state) => state.clearUser)
    const user = useUserStore()

    useEffect(() => {
        const fetchProfileUser = async () => {
            try {
                const res = await api.get(`/auth/profile`, {})
                setUser(res.data.user)

                toast.success(res.data.message)
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Something went wrong in Layout")
            }
        }
        if (!user.userId) fetchProfileUser()
    }, [])

    // Log out
    const handleLogOut = async (userId: string) => {
        try {
            const res = await api.post(`/auth/logout/${userId}`, {})

            Cookies.remove("access_token");
            clearUser()
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong in Layout")
        }
    }


    return (
        <>
            {/* sooner(toast) */}
            <Toaster richColors position="top-right" />

            <NavigationMenu className="m-auto mb-20">
                <NavigationMenuList>
                    <NavigationMenuItem className="flex gap-6">
                        <NavigationMenuLink asChild>
                            <Link to="/">Home</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                            <Link to="/admin">Admin panel</Link>
                        </NavigationMenuLink>

                        {user.userId ? (
                            //    profile
                            < NavigationMenuLink asChild>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2">
                                        <Avatar className="m-auto">
                                            <AvatarImage className="w-full h-full object-cover" src={user.avatar ? import.meta.env.VITE_BASE_URL_WITHOUT_API + "/uploads/" + user.avatar : "https://github.com/maxleiter.png"} />
                                        </Avatar>
                                        {user.username}
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem><Link to={"profile"}>Profile</Link></DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleLogOut(user.userId!)} variant="destructive">
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </NavigationMenuLink>
                        ) : (
                            // auth
                            < NavigationMenuLink asChild>
                                <Link to="/signin">Sign In</Link>
                            </NavigationMenuLink>
                        )}





                        {/* theme */}
                        <NavigationMenuLink asChild>
                            <ModeToggle />
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu >

            {/* Outlet */}
            < Outlet />
        </>
    )
}

export default Layout