import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/ui/Card";
import { FaUsers, FaClipboardList } from "react-icons/fa";
import { toast } from "react-toastify";

const ClubLeaderDashboard = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const leaderName = JSON.parse(localStorage.getItem("user"))?.name || "Club Leader";
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${BASE_URL}/club/get`, {
                headers: { Authorization: `${localStorage.getItem("token")}` },
            });

            setClubs(res.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Error loading clubs");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold mb-6">Club Leader Dashboard</h1>

                {/* Top Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* Club Leader Name */}
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
                        <FaClipboardList className="text-4xl opacity-80" />
                        <div>
                            <p className="text-sm uppercase font-medium">Club Leader Name</p>
                            <p className="text-2xl font-bold">{leaderName}</p>
                        </div>
                    </div>

                    {/* Total Clubs */}
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
                        <FaUsers className="text-4xl opacity-80" />
                        <div>
                            <p className="text-sm uppercase font-medium">Total Clubs</p>
                            <p className="text-2xl font-bold">{clubs.length}</p>
                        </div>
                    </div>
                </div>

                {/* Club List Table */}
                <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Clubs List</h2>

                    {loading ? (
                        <p className="text-gray-500">Loading clubs...</p>
                    ) : clubs.length === 0 ? (
                        <p className="text-gray-500">No clubs found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 text-left text-gray-700">Sr.No</th>
                                        <th className="py-2 px-4 text-left text-gray-700">Logo</th>
                                        <th className="py-2 px-4 text-left text-gray-700">Club Name</th>
                                        <th className="py-2 px-4 text-left text-gray-700">Category</th>
                                        <th className="py-2 px-4 text-left text-gray-700">President</th>
                                        <th className="py-2 px-4 text-left text-gray-700">Vice President</th>
                                        <th className="py-2 px-4 text-left text-gray-700">Expected Members</th>
                                        <th className="py-2 px-4 text-left text-gray-700">Members Joined</th>
                                        {/* <th className="py-2 px-4 text-left text-gray-700">Created By</th> */}
                                        <th className="py-2 px-4 text-left text-gray-700">Created At</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {clubs.map((club, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                            <td className="py-2 px-4">{idx + 1}</td>

                                            <td className="py-2 px-4">
                                                <img
                                                    src={club.clubLogo}
                                                    alt={club.clubName}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            </td>

                                            <td className="py-2 px-4">{club.clubName}</td>
                                            <td className="py-2 px-4">{club.clubCategory}</td>
                                            <td className="py-2 px-4">{club.presidentName || "—"}</td>
                                            <td className="py-2 px-4">{club.vicePresidentName || "—"}</td>
                                            <td className="py-2 px-4">{club.expectedMembers || 0}</td>
                                            <td className="py-2 px-4">{club.members?.length || 0}</td>
                                            {/* <td className="py-2 px-4">{club.createdBy?.name || "—"}</td> */}
                                            <td className="py-2 px-4">
                                                {new Date(club.createdAt).toLocaleDateString()}
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

export default ClubLeaderDashboard;
