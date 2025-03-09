"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { logout, refreshAccessToken } from "@/app/store/slice";
import { useRouter } from "next/navigation";

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { authToken, email } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div>
      <h1>Welcome</h1>

      {authToken ? (
        <div>
          <h3>User Details:</h3>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Access Token:</strong> {authToken}</p>
          {/* <p><strong>Refresh Token:</strong> {refreshToken}</p> */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in. <a href="/login">Login Here</a></p>
      )}
    </div>
  );
};

export default Home;
