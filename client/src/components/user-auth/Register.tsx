import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../../../hooks";

interface RegisterProps {
  closeUserForm: () => void;
  changeToLogin: () => void;
}

const Register = ({ closeUserForm, changeToLogin }: RegisterProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    password: false,
    avatar: false,
  });

  const [redirect, setRedirect] = useState(false);
  const auth = useAuth() as any;

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type !== "file") {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      setFormErrors({ ...formErrors, [name]: false });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, avatar: e.target.files[0] as any });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.avatar
    ) {
      setFormErrors({
        name: !formData.name,
        email: !formData.email,
        password: !formData.password,
        avatar: !formData.avatar,
      });
      console.log("Register failed: Missing fields");
      return;
    }

    const response = await auth.register(formData);
    if (response.success) {
      console.log("User registered");
      closeUserForm();
    } else {
      console.log("Couldn't register user");
    }
  };

  const handleGoogleLogin = async (credential: any) => {
    const response = await auth.googleLogin(credential);
    if (response.success) {
      setRedirect(true);
    } else {
      console.log(response.message);
    }
  };

  return (
    <div className="absolute top-[20rem] w-full max-w-md p-5 border border-gray-200 rounded-lg bg-white flex flex-col items-center">
      <div className="relative w-full flex flex-col gap-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">Register</h1>
        <IoCloseSharp
          onClick={closeUserForm}
          className="absolute top-2 right-2 text-2xl cursor-pointer"
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleFormData}
            className={`p-3 rounded-md border w-full ${
              formErrors.name ? "border-red-500" : "border-gray-200"
            }`}
          />

          <input
            type="email"
            name="email"
            placeholder="youremail@email.com"
            value={formData.email}
            onChange={handleFormData}
            className={`p-3 rounded-md border w-full ${
              formErrors.email ? "border-red-500" : "border-gray-200"
            }`}
          />

          <input
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleFormData}
            className={`p-3 rounded-md border w-full ${
              formErrors.password ? "border-red-500" : "border-gray-200"
            }`}
          />

          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className={`p-3 rounded-md border w-full ${
              formErrors.avatar ? "border-red-500" : "border-gray-200"
            }`}
          />

          <button
            type="submit"
            className="p-3 bg-black text-white rounded-md font-semibold hover:bg-gray-900"
          >
            Register
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 my-4">
          <span className="text-gray-500">or</span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleGoogleLogin(credentialResponse)
            }
            onError={() => console.log("Google login failed")}
            width="350"
          />
        </div>

        <div className="flex justify-center gap-2 mt-5 text-sm">
          <span>Already a member?</span>
          <p
            onClick={changeToLogin}
            className="text-red-500 underline cursor-pointer"
          >
            Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
