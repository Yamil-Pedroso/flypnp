const Trips = () => {
  return (
    <div className="flex flex-col p-4 border-t border-gray-200">
      <div className="flex flex-col gap-2 px-[20rem] text-center items-center">
        <h1 className="text-xl font-medium text-gray-700">
          No trips booked...yet!
        </h1>
        <p className="text-lg font-light text-gray-700">
          Is your next trip booked? Start planning your next adventure with
          Flypnp.
        </p>

        <button className="mt-4 px-6 py-3 bg-[#ff385c] hover:bg-[#ff1e43] text-white text-lg font-medium rounded-md transition-all">
          <a href="/" className="text-white no-underline">
            Start Browsing
          </a>
        </button>
      </div>
    </div>
  );
};

export default Trips;
