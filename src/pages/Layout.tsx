import { Link, Outlet } from "react-router-dom"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { toast, Toaster } from "sonner"
import { useEffect, useState } from "react"
import api from "@/utils/axios"
import useUserStore from "@/store/userStore"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Cookies from "js-cookie"
import { Kbd } from "@/components/ui/kbd"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { MySheet } from "@/components/common/MySheet"

function Layout() {
    const setUser = useUserStore((state) => state.setUser)
    const clearUser = useUserStore((state) => state.clearUser)
    const user = useUserStore()
    const [openCreate, setOpenCreate] = useState(false);

    useEffect(() => {
        const fetchProfileUser = async () => {
            try {
                const res = await api.get(`/auth/profile`)
                setUser(res.data.user)
                toast.success(res.data.message)
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Something went wrong in Layout")
            }
        }
        if (!user.userId) fetchProfileUser()
    }, [])

    const handleLogOut = async (userId: string) => {
        try {
            const res = await api.post(`/auth/logout/${userId}`)
            Cookies.remove("access_token")
            clearUser()
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong in Layout")
        }
    }

    return (
        <>
            <Toaster richColors position="top-right" />

            <Sheet open={openCreate} onOpenChange={setOpenCreate}>
                <MySheet />
            </Sheet>

            <NavigationMenu className="m-auto mb-20" viewport={false}>
                <NavigationMenuList>
                    {/* Home */}
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/">Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Blog posts dropdown */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Blog posts</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-4">
                                <li>
                                    <NavigationMenuLink asChild>
                                        <button
                                            className="flex justify-center items-center cursor-pointer w-full text-left px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-200 transition-colors hover:text-black"
                                            onClick={() => setOpenCreate(true)}
                                        >
                                            Add Post
                                            <Kbd>Ctrl+a</Kbd>
                                        </button>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link to="/myposts" className="flex items-center justify-between">
                                            My posts <Kbd>Ctrl+m</Kbd>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link to="/globalfield" className="flex items-center justify-between">
                                            Global field <Kbd>Ctrl+g</Kbd>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Admin */}
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/admin">Admin panel</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* User dropdown or Sign In */}
                    {user.userId ? (
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage
                                            src={
                                                user.avatar
                                                    ? import.meta.env.VITE_BASE_URL_WITHOUT_API + "/uploads/" + user.avatar
                                                    : "https://github.com/maxleiter.png"
                                            }
                                        />
                                    </Avatar>
                                    {user.username}
                                </div>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[200px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link to="/profile">Profile</Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <button
                                                className="cursor-pointer w-full text-left px-3 py-2 rounded-md border border-red-900 text-red-600 hover:bg-red-900 hover:text-white transition-colors"
                                                onClick={() => handleLogOut(user.userId!)}
                                            >
                                                Log out
                                            </button>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ) : (
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link to="/signin">Sign In</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )}

                    {/* Theme */}
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <ModeToggle />
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <Outlet />
        </>
    )
}

export default Layout
