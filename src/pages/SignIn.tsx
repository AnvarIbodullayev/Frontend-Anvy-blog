import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUserStore from "@/store/userStore";
import api from "@/utils/axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SignInI {
  message: string;
  refresh_token: string;
  access_token: string;
  user: any;
  cleanUser: {
    userId: string;
    username: string;
    email: string;
    role: string;
  };
}

function SignIn() {
  const setUser = useUserStore((state) => state.setUser)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: any) => {
    e.preventDefault()
    try {
      const res = await api.post<SignInI>(`/auth/signin`, { email, password })

      Cookies.set("access_token", res.data.access_token) // 15 minutes
      Cookies.set("refresh_token", res.data.refresh_token) // 7 days

      setUser(res.data.cleanUser)
      toast.success(res.data.message)
      navigate("/")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <Card className="w-full max-w-sm m-auto">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Login to your account</CardTitle>
        <Link to="/signup">
          <Button variant="link">Sign Up</Button>
        </Link>
      </CardHeader>

      <CardContent>
        <form onSubmit={(e) => handleSignIn(e)} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgotpassword"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <CardFooter className="flex-col gap-2 px-0">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default SignIn;
