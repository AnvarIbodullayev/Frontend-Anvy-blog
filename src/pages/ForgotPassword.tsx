import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import api from "@/utils/axios";
import { ScanBarcodeIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function ForgotPassword() {
    const [otp, setOtp] = useState("");
    const [tab, setTab] = useState(true);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // handle Send Otp
    const handleSendOtp = async () => {
        try {
            const res = await api.post("user/forgotpassword", { email })

            setTab(false)
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    // handle Confirm Otp
    const handleConfirmOtp = async () => {
        try {
            const res = await api.post("user/confirmotpforgotpassword", { email, otp })

            navigate("/changepassword", { state: { email } })
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className="w-[30%] m-auto flex flex-col gap-2 items-center">

            <h2 className="mb-4">ForgotPassword</h2>
            {tab ? (
                <>
                    <Input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                    <Button className="w-full cursor-pointer" onClick={handleSendOtp}><SendIcon /> Send OTP</Button>
                </>
            ) : (
                <>
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
                    <Button className="w-full cursor-pointer" onClick={handleConfirmOtp}><ScanBarcodeIcon /> Confirm OTP</Button>
                </>
            )}



        </div>
    )
}

export default ForgotPassword