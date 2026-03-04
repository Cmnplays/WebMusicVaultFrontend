"use client";
import ConfirmUsername from "@/components/Forms/ConfirmUsername";
import { getAccessToken, getUserDetails } from "@/services/auth.services";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { setAccessToken } from "@/reduxSlices/auth/authSlice";
const Page = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getToken = async () => {
      const accessToken = await getAccessToken();
      dispatch(setAccessToken(accessToken));
      await getUserDetails();
    };
    getToken();
  }, []);
  return <ConfirmUsername />;
};

export default Page;
