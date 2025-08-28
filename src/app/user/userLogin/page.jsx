"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiConnector } from "@/utils/apihelper";
import { Eye, EyeOff, Lock, User } from "react-feather";
import { useAuth } from "@/context/AuthContext";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showGooglecode, setShowGooglecode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/user/Checkuserlogin`,
        { email, password }
      );
      const responseData = response?.data?.username;
      if (responseData) {
        login(responseData);
      }

      if (response.status == 200) {
        toast.success(response.data.result.message || "Login successful!");
        router.push("/user/isin/viewUserIsin");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Image & Branding */}
      <div className="relative flex-[4]">
        <img
          src="/assets/images/auth/img-auth-big.jpg"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 text-white text-4xl font-bold">
          Vidatum<span className="text-red-500">.</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-[1] flex items-center justify-center bg-white">
        <div className="w-full px-6 max-w-sm">
          <h2 className="text-center text-xl font-semibold mb-6">
            User Login
          </h2>
          {error && <div className="text-danger text-center mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <User size={18} />
              </span>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type={showGooglecode ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowGooglecode(!showGooglecode)}
              >
                {showGooglecode ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Submit >>"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
