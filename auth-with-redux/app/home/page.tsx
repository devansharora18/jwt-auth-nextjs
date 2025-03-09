"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { logout, refreshAccessToken } from "@/app/store/slice";
import { useRouter } from "next/navigation";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { authToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!authToken) {
      dispatch(refreshAccessToken()).unwrap().catch(() => {
        router.push("/login");
      });
    }
  }, [authToken, dispatch, router]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div>
      <h1>Welcome</h1>

      {authToken ? (
        <div>
          <h3>User Details:</h3>
          <p><strong>Access Token:</strong> {authToken}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in. <a href="/login">Login Here</a></p>
      )}
    </div>
  );
};

export default Home;
