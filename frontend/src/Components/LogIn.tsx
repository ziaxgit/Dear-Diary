import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, { message: "Must be at least 8 characters" }),
});

type UserDataType = z.infer<typeof loginSchema>;

export default function LogIn() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserDataType>({
    defaultValues: {
      email: "test@email.com",
      password: "test",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<UserDataType> = async (loginData) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      navigate("/home");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section
      id="login"
      className="bg-blue-100 flex flex-col items-center min-h-dvh"
    >
      <h1 className="text-5xl font-semibold text-gray-700 mt-12">
        Dear Diary...
      </h1>
      <p className="mt-4 text-md text-gray-800 ">
        Your safe space to journal and self reflect
      </p>
      <div className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-xl p-12 h-[400px] mt-32">
        <h1 className="text-2xl mb-6 font-semibold">Log In</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label>Email</label>
            <input
              {...register("email")}
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              type="text"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <label>Password</label>
            <input
              {...register("password")}
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              type="password"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            disabled={isSubmitting}
            className="bg-blue-300 mt-6 py-1 rounded-full px-12 mx-auto block hover:bg-blue-400"
            type="submit"
          >
            {isSubmitting ? "Loggin in..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}
