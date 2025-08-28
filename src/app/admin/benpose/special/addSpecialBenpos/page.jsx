"use client";
import { apiConnector } from "@/utils/apihelper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddSpecialBenpos = () => {
  const [formData, setFormData] = useState({
    date: "",
    demat: "1",
    nsdl: "1",
    cdsl: "1",
    physical: "1",
    status: "1",
    remarks: "",
    isin: "", // added ISIN field
  });

  const router = useRouter();
  const [isinData, setIsinData] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch ISINs
  const fetchIsin = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/benpose/special/add`
      );
      console.log("responseData", responseData.data);
      setIsinData(responseData.data?.data || []);
    } catch (error) {
      console.error("while fetching error", error);
    }
  };

  useEffect(() => {
    fetchIsin();
  }, []);

  // Submit Benpose
  const handleSubmitBenpose = async () => {
    try {
      const { date, ...rest } = formData;
      const [year, month, day] = date.split("-");
      const formattedDate = `${day}-${month}-${year}`;
      const finalData = { date: formattedDate, ...rest };

      const responseData = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/benpose/special_benpose_index`,
        finalData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (responseData.data.status === true) {
        toast.success("Benpose Added Successfully");
        router.push("benpose/special/specialBenposeList");
      } else {
        toast.error("Cannot add Benpose");
      }
    } catch (error) {
      console.error("Posting data error", error);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="page-title-box">
          <h4 className="page-title">Benpose Index Edit</h4>
        </div>
      </div>

      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-xl-12">
                <div className="alert alert-danger">
                  <ul>
                    <li>Add Benpose</li>
                  </ul>
                </div>
              </div>
            </div>

            <form>
              <div className="row">
                {/* Date Field */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Benpose Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      id="bdate"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* ISIN Dropdown */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Select ISIN <span className="text-danger">*</span>
                    </label>
                    <select
                      name="isin"
                      className="form-control"
                      value={formData.isin}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select ISIN</option>
                      {isinData.length > 0 ? (
                        isinData.map((item, index) => (
                          <option key={index} value={item.isin}>
                            {item.isin}
                          </option>
                        ))
                      ) : (
                        <option disabled>No ISINs available</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Demat */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Demat Records <span className="text-danger">*</span>
                    </label>
                    <select
                      name="demat"
                      className="form-control"
                      value={formData.demat}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">Yes</option>
                      <option value="2">No</option>
                    </select>
                  </div>
                </div>

                {/* CDSL */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      CDSL <span className="text-danger">*</span>
                    </label>
                    <select
                      name="cdsl"
                      className="form-control"
                      value={formData.cdsl}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">Yes</option>
                      <option value="2">No</option>
                    </select>
                  </div>
                </div>

                {/* NSDL */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      NSDL <span className="text-danger">*</span>
                    </label>
                    <select
                      name="nsdl"
                      className="form-control"
                      value={formData.nsdl}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">Yes</option>
                      <option value="2">No</option>
                    </select>
                  </div>
                </div>

                {/* Physical */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Physical Records <span className="text-danger">*</span>
                    </label>
                    <select
                      name="physical"
                      className="form-control"
                      value={formData.physical}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">Yes</option>
                      <option value="2">No</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      name="status"
                      className="form-control"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">Active</option>
                      <option value="2">InActive</option>
                      <option value="3">Delete</option>
                    </select>
                  </div>
                </div>

                {/* Remarks */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Remarks</label>
                    <textarea
                      name="remarks"
                      className="form-control"
                      value={formData.remarks}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="col-md-12">
                  <div className="form-group">
                    <button
                      className="btn btn-dark waves-effect waves-light"
                      type="button"
                      onClick={handleSubmitBenpose}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSpecialBenpos;
