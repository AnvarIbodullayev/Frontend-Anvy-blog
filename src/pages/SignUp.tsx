import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/utils/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SignUpI {
  message: string;
}

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const payload = {
        email,
        password,
        username: username.trim() || undefined, // bo‘sh string → undefined
      }
      const res = await api.post<SignUpI>(`/auth/signup`, payload)

      toast.success(res.data.message)
      navigate("/signin")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  };

  return (
    <Card className="w-full max-w-sm m-auto">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Create your account</CardTitle>
        <CardAction>
          <Link to={"/signin"}>
            <Button variant="link">Sign In</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            {/* username */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="nickname"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {/* email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleSignUp}>
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SignUp;
