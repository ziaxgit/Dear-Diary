import React from "react";

export default function LogIn() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  return (
    <section className="bg-blue-100 flex flex-col items-center min-h-dvh">
      <h1 className="text-5xl font-semibold text-gray-700 mt-12">
        Dear Diary...
      </h1>
      <p className="mt-4 text-md text-gray-800 ">
        Your safe space to journal and self reflect
      </p>
      <div className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-xl p-12 h-[350px] mt-32">
        <h1 className="text-2xl mb-6 font-semibold">Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Email</label>
            <input
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              type="text"
              id="name"
              name="name"
              placeholder="Enter your email"
            />
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              type="password"
              id="name"
              name="name"
              placeholder="Enter your password"
            />
          </div>
          <button
            className="bg-blue-300 mt-6 py-1 rounded-full px-12 mx-auto block hover:bg-blue-400"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
