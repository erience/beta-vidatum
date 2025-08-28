"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiConnector } from "@/utils/apihelper";
import { Eye, EyeOff, Lock, User } from "react-feather";
import { useAuth } from "@/context/AuthContext";

const AdminLogin = () => {
  const [username, setUsername] = useState("A14");
  const [googlecode, setGooglecode] = useState("");
  const [showGooglecode, setShowGooglecode] = useState(false);
  const [resUsername, setResUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiConnector("POST", `${apiUrl}/v2/admin/login`, {
        username,
        googlecode,
      });
      console.log({ response });

      const responseData = response?.data?.username;
      if (responseData) {
        login(responseData);
      }

      if (response.data.status === true) {
        toast.success(response.data.message || "Login successful");
        router.push("/admin/viewIsinReportData");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid username or code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - 80% */}
      <div className="relative flex-[4]">
        <img
          src="/assets/images/auth/img-auth-big.jpg"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 text-white text-3xl font-bold">
          Vidatum Solution Private Limited <span className="text-red-500">.</span>
        </div>
      </div>

      {/* Right Side - 20% */}
      <div className="flex-[1] flex items-center justify-center bg-white">
        <div className="w-full px-6 max-w-xs">
          <h2 className="text-center text-xl font-semibold mb-6">
           Vidatum Solution Private Limited
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <User size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Google 2FA */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type={showGooglecode ? "text" : "password"}
                value={googlecode}
                onChange={(e) => setGooglecode(e.target.value)}
                placeholder="Google 2FA Code"
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                onClick={() => setShowGooglecode(!showGooglecode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showGooglecode ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
