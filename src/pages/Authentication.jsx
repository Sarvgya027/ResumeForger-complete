// src/pages/Authentication.jsx

import React, { useEffect } from "react";
import { Logo } from "../assets";
import { Footer } from "../containers";
import { AuthButtonWithProvider, MainSpinner } from "../components";
import { FaGoogle, FaGithub, FaXTwitter } from "react-icons/fa6";

// import { toast } from "react-toastify";
import UseUser from "../hooks/UseUser";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";

function Authentication() {
  const { data, isLoading, isError } = UseUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && data) {
      navigate("/", { replace: true });
    }
  }, [isLoading, data]);

  if (isLoading) {
    return <MainSpinner />;
  }

  if (data) {
    // User is already authenticated, navigate to home screen
    navigate("/", { replace: true });
    return <MainSpinner />;
  }

  return (
    <div className="auth-section">
      {/* //   top-section */}
      <img className="w-12 h-auto object-contain" src={Logo} alt="logo" />

      {/* main section */}
      <div className="w-full flex flex-1 flex-col items-center justify-center gap-6">
        <h1 className="text-[#000000] text-2xl font-semibold ">
          Welcome to ResumeForger !
        </h1>
        <p>Your Ultimate Resume Building Tool</p>
        {/* <p>Sign in to Your Account</p> */}

        <div className="w-full lg:w-96 rounded-md p-2 flex flex-col items-center justify-start gap-6">
          <AuthButtonWithProvider
            Icon={FaGoogle}
            label={"SignIn with Google"}
            provider={"GoogleAuthProvider"}
          />
          <AuthButtonWithProvider
            Icon={FaGithub}
            label={"SignIn with Github"}
            provider={"GithubAuthProvider"}
          />
          <AuthButtonWithProvider
            Icon={FaXTwitter}
            label={"SignIn with X"}
            provider={"TwitterAuthProvider"}
          />
        </div>
      </div>

      {/* footer section */}
      <Footer />
    </div>
  );
}

export default Authentication;
