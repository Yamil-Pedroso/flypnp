import React from "react";
import { useAuth } from "../../../hooks/index";
import { IoCloseSharp } from "react-icons/io5";

interface UpdateProfileProps {
  closeUserForm: () => void;
}

const UpdateProfile = ({ closeUserForm }: UpdateProfileProps) => {
  const [formData, setFormData] = React.useState({
    name: "",
    password: "",
  });
  const [formErrors, setFormErrors] = React.useState({
    name: false,
    password: false,
  });
  const auth = useAuth() as any;
  const { user, updateUser } = auth;

  const handleFormData = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: false,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const submitData = new FormData();
    if (formData.name) submitData.append("name", formData.name);
    if (formData.password) submitData.append("password", formData.password);

    const response = await updateUser(formData, user._id);
    if (response.success) {
      console.log("User updated");
      user.setUser(response.user);
    } else {
      console.log("Update failed");
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl relative">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Update Profile
      </h1>
      <IoCloseSharp
        onClick={closeUserForm}
        className="absolute top-4 right-4 text-2xl cursor-pointer"
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleFormData}
          placeholder="Edit name"
          className="p-3 rounded-md border border-gray-300"
        />

        <div className="text-center text-gray-400">or 🙃</div>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleFormData}
          placeholder="Edit password"
          className={`p-3 rounded-md border w-full ${
            formErrors.password ? "border-red-500" : "border-gray-300"
          }`}
        />

        <div className="flex gap-4 justify-center mt-4">
          <button
            type="button"
            onClick={closeUserForm}
            className="px-6 py-2 border border-gray-800 text-gray-800 rounded-md hover:bg-gray-800 hover:text-white transition-all"
          >
            Close
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-all"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
