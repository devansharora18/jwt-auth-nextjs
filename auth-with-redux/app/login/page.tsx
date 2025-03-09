"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/app/store/store";
import { loginUser, refreshAccessToken } from "@/app/store/slice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const authToken = useSelector((state: RootState) => state.auth.authToken);

  useEffect(() => {
    if (authToken) {
      dispatch(refreshAccessToken())
        .unwrap()
        .then(() => router.push("/home"))
        .catch(() => {});
    }
  }, [authToken, dispatch, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        setLoading(false);
        router.push("/home");
      } else {
        console.error("Login failed:", resultAction.payload);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Card className="w-full max-w-md p-6 shadow-lg border border-gray-700 bg-gray-800 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-white">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-white">
          <span>Don't have an account?</span>
          <Link href="/register" className="text-blue-400 hover:text-blue-500 ml-1">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
