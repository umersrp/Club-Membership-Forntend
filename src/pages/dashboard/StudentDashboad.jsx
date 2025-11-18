import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import { FaUsers, FaStar, FaClipboardList } from "react-icons/fa";

import Logo from "@/assets/images/logo/logo.png";
import { toast } from "react-toastify";

const StudentDashboard = () => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch student dashboard
            const res = await axios.get(`${BASE_URL}/user/student-dashboard`, {
                headers: { Authorization: `${localStorage.getItem("token")}` },
            });

            setStudentData(res.data?.data || null);
        } catch (error) {
            console.error(error);
            toast.error("Error loading student dashboard data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Points Card */}
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
                        <FaStar className="text-4xl opacity-80" />
                        <div>
                            <p className="text-sm uppercase font-medium">Points</p>
                            <p className="text-2xl font-bold">{studentData?.points || 0}</p>
                        </div>
                    </div>

                    {/* Clubs Joined Card */}
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
                        <FaUsers className="text-4xl opacity-80" />
                        <div>
                            <p className="text-sm uppercase font-medium">Clubs Joined</p>
                            <p className="text-2xl font-bold">{studentData?.totalClubsJoined || 0}</p>
                        </div>
                    </div>

                    {/* Name Card */}
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
                        <FaClipboardList className="text-4xl opacity-80" />
                        <div>
                            <p className="text-sm uppercase font-medium">Student Name</p>
                            <p className="text-2xl font-bold">{studentData?.name || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Clubs Table */}
                <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Clubs Joined</h2>
                    {studentData?.clubs?.length === 0 ? (
                        <p className="text-gray-500">No clubs joined yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 text-left text-gray-700">#</th>
                                        <th className="py-2 px-4 text-left text-gray-700">Club Name</th>
                                        <th className="py-2 px-4 text-left text-gray-700">Category</th>
                                        <th className="py-2 px-4 text-left text-gray-700">Joined At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentData?.clubs?.map((club, idx) => (
                                        <tr
                                            key={idx}
                                            className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                        >
                                            <td className="py-2 px-4">{idx + 1}</td>
                                            <td className="py-2 px-4">{club.clubName}</td>
                                            <td className="py-2 px-4">{club.clubCategory}</td>
                                            <td className="py-2 px-4">
                                                {new Date(club.joinedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </Card>
    );
};

export default StudentDashboard;
