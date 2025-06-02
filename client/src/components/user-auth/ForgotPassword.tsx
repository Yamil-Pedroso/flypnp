const ForgotPassword = () => {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Forgot Password
      </h1>

      <div className="w-full">
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-md border border-gray-300 w-full"
          />

          <button
            type="submit"
            className="p-3 bg-black text-white rounded-md hover:bg-gray-900 transition-all"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
