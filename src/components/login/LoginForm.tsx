"use client";

export default function LoginForm() {
  return (
    <form className="flex flex-col gap-4">
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
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 font-semibold rounded-md hover:bg-blue-600 cursor-pointer transition-colors duration-200">
        Login
      </button>
    </form>
  );
}
