import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../../../hooks";

interface LoginProps {
  closeUserForm: () => void;
  changeToRegister: () => void;
}

const Login = ({ closeUserForm, changeToRegister }: LoginProps) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });
  const [redirect, setRedirect] = useState(false);
  const auth = useAuth() as any;

  const handleFormData = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: false });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setFormErrors({ email: !formData.email, password: !formData.password });
      console.log("Login failed: Missing fields");
      return;
    }
    const response = await auth.login(formData);
    if (response.success) {
      console.log("User logged in");
      setRedirect(true);
      closeUserForm();
    } else {
      console.log("Login failed: Invalid credentials");
      setFormErrors({ email: true, password: true });
    }
  };

  const handleGoogleLogin = async (credential: any) => {
    const response = await auth.googleLogin(credential);
    if (response.success) {
      console.log("User logged in with Google");
    } else {
      console.log(response.message);
    }
  };

  return (
    <div className="absolute top-[20rem] w-full max-w-md p-5 border border-gray-200 rounded-lg bg-white flex flex-col items-center">
      <div className="relative w-full flex flex-col gap-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
        <IoCloseSharp
          onClick={closeUserForm}
          className="absolute top-2 right-2 text-2xl cursor-pointer"
        />
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleFormData}
            className={`p-3 border rounded-md w-full ${
              formErrors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={handleFormData}
            className={`p-3 border rounded-md w-full ${
              formErrors.password ? "border-red-500" : "border-gray-200"
            }`}
          />
          <button
            type="submit"
            className="p-3 bg-black text-white rounded-md font-semibold hover:bg-gray-900"
          >
            Login
          </button>
        </form>

        <div className="flex items-center gap-2 justify-center my-4">
          <span className="text-gray-500">or</span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleGoogleLogin(credentialResponse.credential)
            }
            onError={() => console.log("Login Failed")}
            text="continue_with"
            width="350"
          />
        </div>

        <div className="flex justify-center gap-2 mt-5 text-sm">
          <span>Don't have an account yet?</span>
          <p
            onClick={changeToRegister}
            className="text-red-500 underline cursor-pointer"
          >
            Register now
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
