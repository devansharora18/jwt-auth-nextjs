"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { refreshAccessToken } from "@/app/store/slice";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const authToken = useSelector((state: RootState) => state.auth.authToken);

  useEffect(() => {
    if (!authToken) {
      dispatch(refreshAccessToken())
        .unwrap()
        .catch(() => {
          router.push("/login");
        });
    }
  }, [authToken, dispatch, router]);

  if (!authToken) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
