"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/app/store/store";
import { loginUser, refreshAccessToken } from "@/app/store/slice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const authToken = useSelector((state: RootState) => state.auth.authToken);

  useEffect(() => {
    if (authToken) {
      dispatch(refreshAccessToken()).unwrap()
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">{loading ? "loading" : "Login"}</button>
      </form>

      <Link href="/register">Create New Account</Link>
    </div>
  );
};

export default Login;
