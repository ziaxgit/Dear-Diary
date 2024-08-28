import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, { message: "Must be at least 8 characters" }),
});

type UserDataType = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<UserDataType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<UserDataType> = async (loginData) => {
    try {
      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (!response.ok) {
        resetField("name");
        resetField("email");
        resetField("password");
        throw new Error(data.message);
      }
      toast.success("Register successful!");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      const message = (error as Error).message;
      toast.error(message);
    }
  };

  return (
    <section
      id="login"
      className="bg-blue-100 flex flex-col items-center min-h-dvh"
    >
      <Toaster
        containerStyle={{
          top: "11rem",
        }}
      />

      <h1 className="text-5xl font-semibold text-gray-700 mt-12">
        Dear Diary...
      </h1>

      <p className="mt-4 text-md text-gray-800 ">
        Your safe space to journal and self reflect
      </p>
      <div className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-xl h-[500px] w-[350px] mt-32 ">
        <h1 className="text-2xl mb-8 font-semibold">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label>Name</label>
            <input
              {...register("name")}
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              type="text"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="mt-2 flex flex-col gap-1">
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
          <div className="mt-2 flex flex-col gap-1">
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
            {isSubmitting ? "Registering..." : "Submit"}
          </button>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a className="text-blue-500" href="/login">
              Log In
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
