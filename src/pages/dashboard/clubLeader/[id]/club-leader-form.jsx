import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";
import Select from "@/components/ui/Select"; // Import React Select
import { toast } from "react-toastify";

const ClubLeaderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "add"; // add | view | edit
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    studentId: "",
    clubId: "",
    role: "",
    customRole: "",
    effectiveDate: "",
    notes: "",
  });

  const [clubs, setClubs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(isViewMode || isEditMode);
  const [message, setMessage] = useState("");

  // Fetch clubs for dropdown
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/club/get`, {
          headers: { Authorization: `${token}` },
        });
        const formattedClubs = (res.data.data || []).map((club) => ({
          value: club._id || club.id,
          label: club.name || club.clubName || "Unnamed Club",
        }));
        setClubs(formattedClubs);
      } catch (err) {
        toast.error("Error fetching clubs:", err);
      }
    };
    fetchClubs();
  }, []);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const token = localStorage.getItem("token");

        // fetch students
        const studentsRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user/getStudentByAdmin`,
          { headers: { Authorization: `${token}` } }
        );

        const studentsOptions = (studentsRes.data.data || []).map((s) => ({
          value: s.studentId, // send studentId to backend
          label: s.name || s.username || "Unnamed Student",
          type: "student",
        }));

        // fetch club leaders
        const leadersRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user/get-all-clubLeader`,
          { headers: { Authorization: `${token}` } }
        );

        const leadersOptions = (leadersRes.data.data || []).map((l) => ({
          value: l.studentId, // send studentId to backend
          label: l.name || l.username || "Unnamed Leader",
          type: "leader",
        }));

        setStudents([...studentsOptions, ...leadersOptions]);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching people");
      }
    };

    fetchPeople();
  }, []);


  // useEffect(() => {
  //   const fetchLeader = async () => {
  //     if (!(isViewMode || isEditMode) || !id || id === "add") {
  //       setLoading(false);
  //       return;
  //     }
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_BASE_URL}/user/user/${id}`,
  //         { headers: { Authorization: `${token}` } }
  //       );
  //       const leader = res.data.data || {};

  //       const clubLeadership = leader.clubLeadership?.[0] || {};

  //       setFormData({
  //         studentId: leader.studentId || "",
  //         clubId: clubLeadership.clubId || "",
  //         role: clubLeadership.role || "",
  //         customRole: clubLeadership.customRoleName || "",
  //         effectiveDate: clubLeadership.effectiveDate
  //           ? clubLeadership.effectiveDate.split("T")[0]
  //           : "",
  //         notes: clubLeadership.notes || "",
  //       });
  //     } catch (err) {
  //       console.error("Error fetching leader:", err);
  //       setMessage("Error loading leader data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchLeader();
  // }, [id, isViewMode, isEditMode]);

// In ClubLeaderForm.jsx
useEffect(() => {
  const fetchLeader = async () => {
    if (!(isViewMode || isEditMode) || !id || id === "add") {
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/user/user/${id}`,
        { headers: { Authorization: `${token}` } }
      );
      const leader = res.data.data || {};

      // Get the clubId from navigation state
      const targetClubId = location.state?.clubId;

      // Find the specific club leadership entry
      let clubLeadership = {};
      if (targetClubId && leader.clubLeadership?.length > 0) {
        clubLeadership = leader.clubLeadership.find(
          (cl) => (cl.clubId?._id || cl.clubId) === targetClubId
        ) || leader.clubLeadership[0];
      } else {
        clubLeadership = leader.clubLeadership?.[0] || {};
      }

      setFormData({
        studentId: leader.studentId || "",
        clubId: clubLeadership.clubId?._id || clubLeadership.clubId || "",
        role: clubLeadership.role || "",
        customRole: clubLeadership.customRoleName || "",
        effectiveDate: clubLeadership.effectiveDate
          ? clubLeadership.effectiveDate.split("T")[0]
          : "",
        notes: clubLeadership.notes || "",
      });
    } catch (err) {
      console.error("Error fetching leader:", err);
      toast.error("Error loading leader data");
    } finally {
      setLoading(false);
    }
  };
  fetchLeader();
}, [id, isViewMode, isEditMode, location.state?.clubId]);
  const handleInputChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handleSubmit (with /user/Create-ClubLeader)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    // Basic validation
    if (!formData.studentId) return toast.error("Student ID is required");
    if (!formData.clubId) return toast.error("Club is required");
    if (!formData.role) return toast.error("Role is required");
    if (!formData.effectiveDate) return toast.error("Effective Date is required");
    if (formData.role === "Other" && !formData.customRole.trim())
      return toast.error("Custom role required when role is 'Other'");

    try {
      const token = localStorage.getItem("token");

      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/user/admin-update/${id}`,
          formData,
          {
            headers: { "Content-Type": "application/json", Authorization: `${token}` },
          }
        );
        toast.success("Club leader updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/user/Create-ClubLeader`,
          formData,
          {
            headers: { "Content-Type": "application/json", Authorization: `${token}` },
          }
        );
        toast.success("Club leader created successfully!");
      }

      setTimeout(() => navigate("/club-leader-listing"), 900);
    } catch (err) {
      console.error("Error saving club leader:", err);
      toast.success(err.response?.data?.message || "Error saving club leader");
    }
  };

  if (loading) return <p>Loading leader data...</p>;

  return (
    <div>
      <Card
        title={
          isViewMode ? "View Club Leader" : isEditMode ? "Edit Club Leader" : "Add Club Leader"
        }
      >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="lg:grid-cols-3 grid gap-8 grid-cols-1">
            {/* Student ID dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <Select
                name="studentId"
                value={students.find((s) => s.value === formData.studentId) || null}
                onChange={(selected) => {
                  setFormData((prev) => ({
                    ...prev,
                    studentId: selected?.value || "", // studentId always
                  }));
                }}
                options={students}
                allowCustomInput
                isDisabled={isViewMode}
                placeholder="Select Student or Club Leader"
              />

            </div>

            {/* Club dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Club Association</label>
              <Select
                name="club"
                value={clubs.find((c) => c.value === formData.clubId) || null}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, clubId: selected?.value || "" }))
                }
                options={clubs}
                isDisabled={isViewMode}
                placeholder="Select Club"
                classNamePrefix="react-select"
                allowCustomInput
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">Leadership Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                disabled={isViewMode}
              >
                <option value="">Select Role</option>
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Event Coordinator">Event Coordinator</option>
                <option value="Other">Other (Custom)</option>
              </select>
            </div>

            {/* Custom Role */}
            {formData.role === "Other" && (
              <div>
                <label className="block text-sm font-medium mb-1">Custom Role</label>
                <input
                  type="text"
                  name="customRole"
                  value={formData.customRole}
                  onChange={handleInputChange}
                  className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  readOnly={isViewMode}
                />
              </div>
            )}

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Effective Date</label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                readOnly={isViewMode}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">Notes / Justification</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={1}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                readOnly={isViewMode}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              text="Cancel"
              className="btn-light "
              type="button"
              onClick={() => navigate("/club-leader-listing")}
            />
            {!isViewMode && (
              <Button
                text={isEditMode ? "Update Leader" : "Add Leader"}
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

export default ClubLeaderForm;
