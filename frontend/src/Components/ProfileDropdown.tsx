import Title from "./Title";
import Subtitle from "./Subtitle";
import { FaUserCircle } from "react-icons/fa";
import { logOutUserFn } from "../utils/apiCalls.js";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { User } from "../App.js";

export interface User {
  user_id: number;
  name: string;
  email: string;
  token: string;
  createdAt: string;
}

export default function ProfileDropdown({
  currentUser,
}: {
  currentUser: User | null;
}) {
  const navigate = useNavigate();
  const logOutUserMutation = useMutation({
    mutationFn: () => logOutUserFn(currentUser),
  });

  const handleLogOut = () => {
    logOutUserMutation.mutate();
    toast.success("Logout successful");
    setTimeout(() => {
      navigate("/login");
    }, 2500);
  };
  return (
    <div className="relative pt-5 dropdown">
      <div className="text-center -mt-5">
        <Title />
        <Subtitle />
        <div className="group">
          <div className="absolute top-8 bottom-0 right-2">
            <FaUserCircle
              className="cursor-pointer hover:bg-sky-500 bg-gray-200 rounded-full"
              size={50}
            />
          </div>
          <div className="absolute right-0 -mt-2 mr-2 bg-gray-50 p-2 hidden group-hover:block transition-opacity duration-200 rounded-md gap-1 shadow-md">
            <p className="border-b-[1px] border-b-gray-300 mb-1">
              Logged in as
            </p>
            <p className="border-b-[1px] border-b-gray-100 text-sm font-light mb-2">
              {currentUser?.email}
            </p>
            <button
              className="bg-gray-200 w-full text-black rounded-md hover:bg-gray-400"
              onClick={handleLogOut}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
