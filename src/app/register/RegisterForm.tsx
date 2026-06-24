"use client";

export default function RegisterForm() {
  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-semibold">
          Name
        </label>
        <input type="text" id="name" placeholder="Enter your name" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <input type="email" id="email" placeholder="Enter your email" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <input type="password" id="password" placeholder="Enter your password" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex gap-2 items-center">
        <input type="checkbox" id="venueManager" className="w-4 h-4" />
        <label htmlFor="venueManager" className="font-semibold">
          Register as a venue manager
        </label>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 font-semibold rounded-md hover:bg-blue-600 cursor-pointer transition-colors duration-200">
        Register
      </button>
    </form>
  );
}
