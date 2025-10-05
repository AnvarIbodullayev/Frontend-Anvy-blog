import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import api from "@/utils/axios"
import { toast } from "sonner"
import { useLocation, useNavigate } from "react-router-dom"

function ChangePassword() {
    const location = useLocation()
    const email = location.state?.email
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState("")
    const [reEnterNewPassword, setReEnterNewPassword] = useState("")

    const handleClick = async () => {
        if (!newPassword || !reEnterNewPassword) {
            alert("Please fill both fields")
            return
        }

        if (newPassword !== reEnterNewPassword) {
            alert("Passwords do not match")
            return
        }

        // send to backend (example)
        try {
            const res = await api.post("user/forgotchangepassword", { email, newPassword })

            navigate("/signin")

            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className="w-full max-w-sm space-y-4 m-auto">
            <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="reEnterPassword">Re-enter Password</Label>
                <Input
                    id="reEnterPassword"
                    type="password"
                    value={reEnterNewPassword}
                    onChange={(e) => setReEnterNewPassword(e.target.value)}
                />
            </div>

            <Button onClick={handleClick} className="w-full">
                Change Password
            </Button>
        </div>
    )
}

export default ChangePassword
