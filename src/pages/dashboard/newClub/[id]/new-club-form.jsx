import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Fileinput from "@/components/ui/Fileinput";
import axios from "axios";
import { toast } from "react-toastify";

const NewClubForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);

  const mode = location.state?.mode || "add"; // add | view | edit
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    clubName: "",
    clubDescription: "",
    clubCategory: "",
    targetMajor: [],
    targetGender: "",
    targetYear: [],
    proposedActivities: [],
    clubLogo: "",
    socialLinks: [],
    presidentName: "",
    presidentId: "",
    vicePresidentName: "",
    vicePresidentId: "",
    justification: "",
    expectedMembers: "",
    members: [],
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(isViewMode || isEditMode);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user/getStudentByAdmin`,
          { headers: { Authorization: `${token}` } }
        );
        setStudents(res.data.data || []);
      } catch (err) {
        toast.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);

  // Fetch existing club data for view/edit
  useEffect(() => {
    const fetchClub = async () => {
      if (!(isViewMode || isEditMode) || !id || id === "add") {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/club/${id}`,
          { headers: { Authorization: `${token}` } }
        );
        const club = res.data.data || {};
        setFormData({
          clubName: club.clubName || "",
          clubDescription: club.clubDescription || "",
          clubCategory: club.clubCategory || "",
          targetMajor: club.targetMajor || "",
          targetGender: club.targetGender || "",
          targetYear: club.targetYear || "",
          proposedActivities: club.proposedActivities || "",
          socialLinks: club.socialLinks || "",
          presidentName: club.presidentName || "",
          presidentId: club.presidentId || "",
          vicePresidentName: club.vicePresidentName || "",
          vicePresidentId: club.vicePresidentId || "",
          justification: club.justification || "",
          expectedMembers: club.expectedMembers || "",
          members: club.members || [],
        });
      } catch (err) {
        console.error("Error fetching club:", err);
        toast.error("Error loading club data");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id, isViewMode, isEditMode]);

  const handleChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (isViewMode) return;
    setFormData((prev) => ({ ...prev, clubLogo: e.target.files[0] }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!formData.clubName.trim())
      return toast.error("Club Name is required");
    if (!formData.clubDescription.trim())
      return toast.error("Club Description is required");
    if (!formData.clubCategory.trim())
      return toast.error("Club Category is required");
    if (!formData.presidentName.trim() || !formData.presidentId.trim())
      return toast.error("President Name and ID are required");

    try {
      const token = localStorage.getItem("token");

      //  Upload logo first (if provided)
      let logoUrl = "";
      if (formData.clubLogo) {
        logoUrl = await handleFileUpload(); // keep this as your existing logic
      }

      //  Convert string fields to arrays if needed
      const payload = {
        ...formData,
        targetMajor:
          typeof formData.targetMajor === "string"
            ? formData.targetMajor.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.targetMajor,

        targetYear:
          typeof formData.targetYear === "string"
            ? formData.targetYear.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.targetYear,

        proposedActivities:
          typeof formData.proposedActivities === "string"
            ? formData.proposedActivities.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.proposedActivities,

        socialLinks:
          typeof formData.socialLinks === "string"
            ? formData.socialLinks.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.socialLinks,

        clubLogo: logoUrl, //  use uploaded logo URL
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      };

      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/club/${id}`,
          payload,
          { headers }
        );
        toast.success("Club updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/Club/Create`,
          payload,
          { headers }
        );
        toast.success("Club created successfully! Pending admin approval.");
      }

      setTimeout(() => navigate("/new-club-listing"), 900);
    } catch (err) {
      console.error("Error saving club:", err.response?.data || err);
      toast.error("Error saving club");
    }
  };
  //  Upload file to backend and return the file URL
  const handleFileUpload = async () => {
    if (!formData.clubLogo) return ""; // No file selected

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("documentFile", formData.clubLogo); // key = documentFile

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/upload/upload`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );

      //  Correct way (your backend returns the URL in res.data.data)
      return res.data?.data || "";
    } catch (err) {
      console.error("File upload failed:", err);
      toast.error("Error uploading logo");
      return "";
    }
  };
const handleRemoveMember = async (memberId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/Joining-requests/delete-membership/${memberId}/${id}`,
      {},
      { headers: { Authorization: `${token}` } }
    );

    toast.success("Member removed successfully");

    // Update UI instantly
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m._id !== memberId),
    }));

  } catch (err) {
    console.error(err);
    toast.error("Failed to remove member");
  }
};

  if (loading) return <p>Loading club data...</p>;

  return (
    <div>
      <Card
        title={
          isViewMode
            ? "View Club Proposal"
            : isEditMode
              ? "Edit Club Proposal"
              : "Create New Club"
        }
      >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Club Name */}
            <div>
              <label className="block mb-1 text-sm font-medium">Club Name</label>
              <input
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                readOnly={isViewMode}
              />
            </div>

            {/* Club Description */}
            <div className="">
              <label className="block mb-1 text-sm font-medium">
                Club Description / Purpose
              </label>
              <textarea
                name="clubDescription"
                value={formData.clubDescription}
                onChange={handleChange}
                rows={1}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                readOnly={isViewMode}
              />
            </div>

            {/* Club Category */}
            <div>
              <label className="block mb-1 text-sm font-medium">Club Category</label>
              <select
                name="clubCategory"
                value={formData.clubCategory}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                disabled={isViewMode}
              >
                <option value="">Select Category</option>
                <option value="Academic">Academic</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Technical">Technical</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block mb-1 text-sm font-medium">Major / Department</label>
              <input
                name="targetMajor"
                value={formData.targetMajor}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Gender</label>
              <select
                name="targetGender"
                value={formData.targetGender}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                disabled={isViewMode}
              >
                <option value="">Select</option>
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Year Level</label>
              <input
                name="targetYear"
                value={formData.targetYear}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            {/* Proposed Activities */}
            <div className="lg:col-span-3">
              <label className="block mb-1 text-sm font-medium">
                Proposed Activities
              </label>
              <textarea
                name="proposedActivities"
                value={formData.proposedActivities}
                onChange={handleChange}
                rows={2}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            {/* Club Logo */}
            <div>
              <label className="block mb-1 text-sm font-medium">Club Logo / Image</label>
              <input
                type="file"
                name="clubLogo"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isViewMode}
                className="border p-2 w-full rounded"
              />
            </div>

            {/* Social Links */}
            <div className="">
              <label className="block mb-1 text-sm font-medium">
                Social Media Links (optional)
              </label>
              <input
                name="socialLinks"
                value={formData.socialLinks}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            {/* Leadership */}
            <div>
              <label className="block mb-1 text-sm font-medium">President</label>
              <select
                name="presidentId"
                value={formData.presidentId}
                onChange={(e) => {
                  const selectedStudent = students.find((s) => s._id === e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    presidentId: selectedStudent?._id || "",
                    presidentName: selectedStudent?.name || "",
                  }));
                }}
                className="border p-2 w-full rounded"
                disabled={isViewMode}
              >
                <option value="">Select President</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.studentId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">President Name</label>
              <input
                name="presidentName"
                value={formData.presidentName}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Vice President</label>
              <select
                name="vicePresidentId"
                value={formData.vicePresidentId}
                onChange={(e) => {
                  const selectedStudent = students.find((s) => s._id === e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    vicePresidentId: selectedStudent?._id || "",
                    vicePresidentName: selectedStudent?.name || "",
                  }));
                }}
                className="border p-2 w-full rounded"
                disabled={isViewMode}
              >
                <option value="">Select Vice President</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.studentId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Vice President Name</label>
              <input
                name="vicePresidentName"
                value={formData.vicePresidentName}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>



            {/* Justification */}
            <div className="lg:col-span-3">
              <label className="block mb-1 text-sm font-medium">
                Justification / Vision Statement
              </label>
              <textarea
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                rows={2}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            {/* Expected Members */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Expected Number of Members
              </label>
              <input
                name="expectedMembers"
                value={formData.expectedMembers}
                onChange={handleChange}
                type="number"
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>
          </div>

          {(isViewMode || isEditMode) && formData.members?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Club Members</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3 text-left border">Sr.No</th>
                      <th className="p-3 text-left border">Name</th>
                      <th className="p-3 text-left border">Student ID</th>
                      <th className="p-3 text-left border">Email</th>
                      {isEditMode && <th className="p-3 text-left border">Action</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {formData.members.map((m, index) => (
                      <tr key={m._id || index} className="odd:bg-white even:bg-gray-50">
                        <td className="p-3 border">{index + 1}</td>
                        <td className="p-3 border font-medium">{m.name}</td>
                        <td className="p-3 border">{m.studentId}</td>
                        <td className="p-3 border text-sm text-gray-700">{m.email}</td>

                        {isEditMode && (
                          <td className="p-3 border">
                            <button
                              type="button"
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveMember(m._id);
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              text="Cancel"
              className="btn-light"
              type="button"
              onClick={() => navigate("/new-club-listing")}
            />
            {!isViewMode && (
              <Button
                text={isEditMode ? "Update Club" : "Submit Proposal"}
                className="btn-primary"
                type="submit"
              />
            )}
          </div>
        </form>

        {message && (
          <div className="mt-4">
            <p className="text-center">{message}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NewClubForm;
