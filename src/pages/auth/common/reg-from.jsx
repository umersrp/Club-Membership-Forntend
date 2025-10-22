import React, { useState } from "react";
import { toast } from "react-toastify";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

const RegForm = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    studentId: "",
    major: "",
    yearOfStudy: "",
    interests: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checked) {
      toast.error("You must accept Terms and Conditions");
      return;
    }

    setLoading(true);
    try {
      const formattedData = {
        ...formData,
        type: "student",
        interests: formData.interests
          ? formData.interests.split(",").map((i) => i.trim())
          : [],
      };

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/user/student`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
        }
      );

      const data = await res.json();
      console.log("Register student response:", data);

      if (!res.ok) throw new Error(data.message || "Student registration failed");

      toast.success("Student registered successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Grid layout for fields */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Left column */}
        <div>
          <label>Username</label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="form-control h-[48px] w-full px-3 border rounded"
          />
        </div>

        <div>
          <label>Full Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="form-control h-[48px] w-full px-3 border rounded"
          />
        </div>

        <div>
          <label>Student ID</label>
          <input
            name="studentId"
            type="text"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Enter student ID"
            className="form-control h-[48px] w-full px-3 border rounded"
          />
        </div>

        <div>
          <label>Major</label>
          <input
            name="major"
            type="text"
            value={formData.major}
            onChange={handleChange}
            placeholder="e.g., Computer Science"
            className="form-control h-[48px] w-full px-3 border rounded"
          />
        </div>

        <div>
          <label>Year of Study</label>
          <input
            name="yearOfStudy"
            type="number"
            value={formData.yearOfStudy}
            onChange={handleChange}
            placeholder="e.g., 3"
            className="form-control h-[48px] w-full px-3 border rounded"
          />
        </div>

        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-control h-[48px] w-full px-3 border rounded"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label>Interests (comma separated)</label>
          <input
            name="interests"
            type="text"
            value={formData.interests}
            onChange={handleChange}
            placeholder="e.g., AI, Cybersecurity, Community Service"
            className="form-control h-[48px] w-full px-3 border rounded"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="form-control h-[48px] w-full px-3 border rounded"
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="form-control h-[48px] w-full px-3 border rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="form-control h-[48px] w-full px-3 border rounded"
          />
        </div>
      </div>

      {/* Checkbox & Button */}
      <div className="space-y-3 ">
        <Checkbox
          label="I accept Terms and Conditions & Privacy Policy"
          value={checked}
          onChange={() => setChecked(!checked)}
        />

        <Button
          type="submit"
          text={loading ? "Registering..." : "Register Student"}
          className="btn btn-primary block w-full text-center"
          isLoading={loading}
        />
      </div>
    </form>
  );
};

export default RegForm;
