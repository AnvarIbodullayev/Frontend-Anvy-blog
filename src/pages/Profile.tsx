import useUserStore from "@/store/userStore"
import { AppWindowIcon, BadgeCheckIcon, CodeIcon, Lock, ScanBarcode, ScanBarcodeIcon, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import api from "@/utils/axios"
import { toast } from "sonner"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

function Profile() {
    const user = useUserStore()
    const [username, setUsername] = useState("")
    const [currentPassword, setCurrentP] = useState("")
    const [newPassword, setNewP] = useState("")
    const [reEnterNewPassword, setReNewP] = useState("")
    const [otp, setOtp] = useState("");
    const [picture, setPicture] = useState<File | null>(null)

    console.log("user: ", user);


    const [tab, setTab] = useState(true)

    // it changes just username
    const handleSubmitUsername = async (id: string) => {
        try {
            const res = await api.put(`/user/${id}`, { username })

            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong in Layout")
        }
    }

    // save password send OTP
    const handleSavePassword = async () => {
        try {
            const res = await api.put(`/user/password/${user.userId}`, { currentPassword, newPassword, reEnterNewPassword })

            setTab(false)
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong in Layout")
        }
    }

    // handle confirm OTP
    const handleConfirmOtp = async () => {
        try {
            const res = await api.post(`/user/otp/confirm/${user.userId}`, { otp })

            setTab(true)
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong in Layout")
        }
    }



    // handle Send Profile Picture
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPicture(e.target.files[0]);
        }
    };

    const handleSendProfilePicture = async () => {
        if (!picture) {
            toast.error("Please select picture first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", picture);

        try {
            const res = await api.post(`/uploads/avatar/${user.userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            toast.success(res.data.message)

            useUserStore.setState((prev) => ({
                ...prev,
                avatar: res.data.avatarUrl
            }));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong in Layout")
        }
    }

    return (
        <>
            <div className="grid grid-cols-2 h-screen gap-4">
                {/* left */}
                <div className="p-8 rounded-lg shadow-sm border-1 text-left">
                    {/* Profile info */}
                    <Avatar className="w-40 h-40 m-auto">
                        <AvatarImage className="w-full h-full object-cover" src={user.avatar ? import.meta.env.VITE_BASE_URL_WITHOUT_API + "/uploads/" + user.avatar : "https://github.com/maxleiter.png"} />
                    </Avatar>
                    <div className="grid w-full max-w-sm items-center gap-3 my-6">
                        <Label htmlFor="picture">Profile picture</Label>
                        <div className="flex gap-2">
                            <Input onChange={handleFileChange} id="picture" type="file" />
                            <Button onClick={handleSendProfilePicture} size={"icon"}><Send /></Button>
                        </div>
                    </div>
                    {/* <h2 className="text-lg font-semibold text-white-800 mb-3">User Info</h2> */}
                    <div className="space-y-4 text-sm text-white-600">
                        <Badge
                            variant="secondary"
                            className="bg-blue-500 text-white dark:bg-blue-600"
                        >
                            <BadgeCheckIcon />
                            Verified
                        </Badge>
                        <p><span className="font-bold">Role:</span> {user.role}</p>
                        <p><span className="font-bold">ID:</span> {user.userId}</p>
                    </div>
                </div>

                {/* right */}
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <Tabs defaultValue="account">
                        <TabsList>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    {/* Account */}
                                    <CardTitle>Account</CardTitle>
                                    <CardDescription>
                                        Make changes to your account here. Click save when you&apos;re
                                        done.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="tabs-demo-username">Username</Label>
                                        <Input onChange={(e) => setUsername(e.target.value)} id="tabs-demo-username" defaultValue={user.username} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="tabs-demo-email">Email</Label>
                                        <Input id="tabs-demo-email" defaultValue={user.email} />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={() => handleSubmitUsername(user.userId!)}>Save changes</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    {/* Password */}
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>
                                        Change your password here. After saving, you&apos;ll receive OTP.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    {tab ? (
                                        // passwords field
                                        <>
                                            <div className="grid gap-3">
                                                <Label htmlFor="tabs-demo-current">Current password</Label>
                                                <Input onChange={(e) => setCurrentP(e.target.value)} id="tabs-demo-current" type="password" />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="tabs-demo-new">New password</Label>
                                                <Input onChange={(e) => setNewP(e.target.value)} id="tabs-demo-new" type="password" />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="tabs-demo-repeatnew">Re-enter new password</Label>
                                                <Input onChange={(e) => setReNewP(e.target.value)} id="tabs-demo-repeatnew" type="password" />
                                            </div>
                                        </>
                                    ) : (
                                        // OTP field
                                        <>
                                            <Label htmlFor="otp">Enter OTP code</Label>
                                            <InputOTP
                                                maxLength={6}
                                                onChange={(value: string) => setOtp(value)}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>

                                        </>
                                    )}

                                </CardContent>

                                {/* submit password button */}
                                <CardFooter>
                                    {tab ? (
                                        <Button onClick={handleSavePassword}><Lock />Save password</Button>
                                    ) : (
                                        <Button onClick={handleConfirmOtp}><ScanBarcodeIcon /> Confirm OTP</Button>
                                    )}


                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>

    )
}

export default Profile