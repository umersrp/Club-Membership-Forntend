import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import RegForm from "./common/reg-from";
import Social from "./common/social";
import { ToastContainer } from "react-toastify";

// image imports
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.png";
import BgImage from "@/assets/images/all-img/bg-image.jpg"; // ✅ your background

const Register = () => {
  const [isDark] = useDarkMode();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-10"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      {/* Centered Registration Card */}
      <div className="bg-white/60  dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-3xl mx-4">
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src={isDark ? LogoWhite : Logo}
              alt="Logo"
              className="mx-auto mb-4 w-32"
            />
          </Link>
          <h4 className="font-semibold text-2xl text-slate-800 dark:text-white">
            Sign Up
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Create an account to join university clubs & societies
          </p>
        </div>

        <RegForm />

        {/* Divider */}
        {/* <div className="relative border-b border-slate-300 dark:border-slate-700 my-6">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white dark:bg-slate-800 px-3 text-sm text-slate-500">
            Or continue with
          </div>
        </div> */}

        {/* <div className="max-w-[240px] mx-auto">
          <Social />
        </div> */}

        <div className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
          Already registered?{" "}
          <Link
            to="/"
            className="text-[#205b67ff] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
