"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/app/store/store";
import { registerUser, refreshAccessToken } from "@/app/store/slice";

const Register = () => {
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
      const resultAction = await dispatch(registerUser({ email, password }));

      if (registerUser.fulfilled.match(resultAction)) {
		setLoading(false);
        router.push("/login");
      } else {
        console.error("Registration failed:", resultAction.payload);
		setLoading(false);
      }
    } catch (error) {
      console.error("Error registering:", error);
	  setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>
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

        <button type="submit">{loading ? "loading" : "Register"}</button>
      </form>

      <Link href="/login">Already have an account? Login</Link>
    </div>
  );
};

export default Register;
