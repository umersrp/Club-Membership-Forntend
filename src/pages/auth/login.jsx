import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";

// image imports
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/Srplogo.png";
import BgImage from "@/assets/images/all-img/bg-image.jpg"; // ✅ your background image

const Login = () => {
  const [isDark] = useDarkMode();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${BgImage})`, // ✅ background image
      }}
    >
      <div className="bg-white/60 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl w-[90%] max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/">
            <img
              src={isDark ? LogoWhite : Logo}
              alt="Logo"
              className="mx-auto h-10 mb-2"
            />
          </Link>
          <h4 className="font-semibold text-lg text-slate-700 dark:text-slate-200">
            Welcome Back!
          </h4>
          <p className="text-slate-500 text-sm dark:text-slate-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Divider */}
        {/* <div className="relative border-b border-slate-300 dark:border-slate-600 mt-6">
          <span className="absolute left-1/2 top-1/2 bg-white dark:bg-slate-800 transform -translate-x-1/2 -translate-y-1/2 px-3 text-sm text-slate-500">
            OR
          </span>
        </div> */}

        {/* Social Logins
        <div className="max-w-[242px] mx-auto mt-8 w-full">
          <Social />
        </div> */}

        {/* Sign Up Link */}
        <div className="text-center mt-4 text-sm text-slate-600 dark:text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-slate-900 dark:text-white font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-700 mt-4">
          © 2025 University Society Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
