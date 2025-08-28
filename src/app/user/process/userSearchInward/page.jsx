"use client";
import { apiConnector } from "@/utils/apihelper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useBenposeStore } from "../../../../../store/benposeStore";

const UserSearchInward = () => {
  const [dataLf, setDataLf] = useState([]);
  const [lf, setLf] = useState("");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const setFormData = useBenposeStore((state) => state.setFormData);

  const handleChange = (e) => {
    const { value } = e.target;
    setLf(value);
  };

  const fetchInwardData = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/user/process/search`,
        { lf }
      );
      const result = response.data.result.inward;
      setDataLf(result);

      if (response.status == 200) {
        // toast.success(response.data.result.message);
        setFormData(result);
        router.push("/user/process/userSearchInwardData");
      } else {
        toast.error("Failed to fetch data", response.data.result.message);
      }

      console.log(response.data);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data", error);
    }
  };

  return (
    <>
      <div className="card">
        <div className="row">
          <div className="col-sm-12">
            <div className="card-header pb-0">
              <div className="row">
                <div className="col-12">
                  <h4>Search Inward</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              <form id="inward-add" onSubmit={fetchInwardData}>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="floating-label">Please Enter Lf</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lf"
                        value={lf}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-dark mt-2">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSearchInward;
