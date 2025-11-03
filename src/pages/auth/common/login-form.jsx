import React, { useState } from "react";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const UserRole = Object.freeze({
    ADMIN: "admin",
    STUDENT: "student",
    CLUB_LEADER: "ClubLeader",
  });

  // ✅ handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ handle login API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
         `${process.env.REACT_APP_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("Login Response:", result);

      const { data, message } = result;

      // if backend returns a failed status
      if (!response.ok) throw new Error(message || "Login failed");
      if (!data?.token) throw new Error("Invalid credentials");

      // ✅ Save token & user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user-name", data.user.name);
      localStorage.setItem("user-role", data.user.type);

      toast.success("Login Successful!");

      // ✅ Navigate by role
      const userRole = data.user.type;
      switch (userRole) {
        case UserRole.ADMIN:
          navigate("/new-club-listing"); // your admin page
          break;

        case UserRole.STUDENT:
          navigate("/club-listing"); // student dashboard or club listing
          break;

        case UserRole.CLUB_LEADER:
          navigate("/event-listing"); // club leader page
          break;

        default:
          throw new Error("Unknown user role");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>Email</label>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        className="form-control h-[48px] w-full px-3 border rounded mb-4"
      />

      <label>Password</label>
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        className="form-control h-[48px] w-full px-3 border rounded"
      />

      <div className="flex justify-between items-center">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 font-medium"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        text={loading ? "Signing in..." : "Sign in"}
        className="btn btn-primary block w-full text-center"
        isLoading={loading}
      />
    </form>
  );
};

export default LoginForm;
