import React, { useState } from "react";
import axios from "axios";
import EmployeeList from "./EmployeeList";
import { backendURL } from "./url";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const departments = ["HR", "Engineering", "Marketing"];
const countryCodes = [
  { code: "+91", country: "India", regex: /^\d{10}$/ },
  { code: "+1", country: "USA", regex: /^\d{10}$/ },
  { code: "+44", country: "UK", regex: /^\d{10}$/ },
  { code: "+69", country: "Kailasa", regex: /^\d{9}$/ },
];

function App() {
  const [formData, setFormData] = useState({
    name: "",
    employee_id: "",
    email: "",
    phone_number: "",
    country_code: "+91",
    department: "",
    date_of_joining: "",
    role: "",
  });

  const [error, setError] = useState({});
  const [message, setMessage] = useState("");
  const [value, setValue] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setMessage("");

    // Frontend validation
    const newError = {};
    if (!formData.name){
      newError.name = "Name is required.";
      toast.error(newError.name);
    }
    if (!formData.employee_id){
      newError.employee_id = "Employee ID is required.";
      toast.error(newError.employee_id);

    }
    if (!formData.email.includes("@")){
      newError.email = "Invalid email.";
      toast.error(newError.email);
      
    }


    // Validate phone number based on selected country code
    const selectedCountry = countryCodes.find(
      (cc) => cc.code === formData.country_code,
    );
    if (!selectedCountry.regex.test(formData.phone_number)) {
      newError.phone_number = `Invalid phone number for ${selectedCountry.country}`;
      toast.error(newError.phone_number);
    }

    if (!formData.department) {
      newError.department = "Department is required.";
      toast.error(newError.department);
    }
    if (
      !formData.date_of_joining ||
      new Date(formData.date_of_joining) >
        new Date(new Date().setDate(new Date().getDate() + 1))
    ) {
      newError.date_of_joining = "Date is required";
      toast.error(newError.date_of_joining);
    }
    if (!formData.role) {
      newError.role = "Role is required.";
      toast.error(newError.role);
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    // Submit to backend
    try {
      const res = await axios.post(
          `${backendURL}/add-employee`,
        formData,
      );
      setMessage(res.data);
      toast.success("Employee added successfully!");
      setFormData({
        name: "",
        employee_id: "",
        email: "",
        phone_number: "",
        country_code: "+91",
        department: "",
        date_of_joining: "",
        role: "",
      });
      
    } catch (err) {
      toast.error("Failed to add employee!");
      setMessage(err.response.data);
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate());
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <ToastContainer />
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white text-center py-4">
          <h1 className="text-3xl font-bold">Employee Management System</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {error.name && <small className="text-red-500 text-sm">{error.name}</small>}
          </div>

          {/* Employee ID Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Employee ID:</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error.employee_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {error.employee_id && <small className="text-red-500 text-sm">{error.employee_id}</small>}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {error.email && <small className="text-red-500 text-sm">{error.email}</small>}
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number:</label>
            <div className="flex space-x-2">
              <select
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countryCodes.map((cc) => (
                  <option key={cc.code} value={cc.code}>
                    {cc.country} ({cc.code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`w-2/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  error.phone_number ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </div>
            {error.phone_number && <small className="text-red-500 text-sm">{error.phone_number}</small>}
          </div>

          {/* Department Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error.department ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
            {error.department && <small className="text-red-500 text-sm">{error.department}</small>}
          </div>

          {/* Date of Joining Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Date of Joining:</label>
            <input
              type="date"
              name="date_of_joining"
              value={formData.date_of_joining}
              onChange={handleChange}
              max={getMaxDate()}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error.date_of_joining ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {error.date_of_joining && <small className="text-red-500 text-sm">{error.date_of_joining}</small>}
          </div>

          {/* Role Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Role:</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {error.role && <small className="text-red-500 text-sm">{error.role}</small>}
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
            <button
              type="reset"
              onClick={() =>
                setFormData({
                  name: "",
                  employee_id: "",
                  email: "",
                  phone_number: "",
                  country_code: "+91",
                  department: "",
                  date_of_joining: "",
                  role: "",
                })
              }
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Reset
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-3 rounded-md text-center`}>
              {message}
            </div>
          )}
        </form>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <EmployeeList />
      </div>
    </div>
  );
}

export default App;