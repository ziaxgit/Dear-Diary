import React, { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useContext } from "react";
import { UserContext } from "../App";
import DiaryCard, { DiaryCardProps } from "../Components/DiaryCard";
import { convertDate } from "../utils/dateTimeConverter.ts";
import { FaUserCircle } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { fetchDiariesFn, logOutUserFn } from "../utils/apiCalls.js";
import Title from "../Components/Title.tsx";
import Subtitle from "../Components/Subtitle.tsx";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedDiary, setSelectedDiary] =
    React.useState<DiaryCardProps | null>(null);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["diaries"],
    queryFn: () => fetchDiariesFn(currentUser),
  });

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

  useEffect(() => {
    if (data && data.diaries.length > 0) {
      setSelectedDiary(data.diaries[0]);
    }
  }, [data]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  console.log({ selectedDiary });

  const handleDiaryClick = (diary: DiaryCardProps) => {
    setSelectedDiary(diary);
    return true;
  };

  return (
    <section
      id="login"
      className="bg-sky-image bg-cover min-h-screen px-[10vw]"
    >
      {/* <Toaster
        containerStyle={{
          top: "10rem",
        }}
      /> */}
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
                className="bg-gray-300 w-full text-black rounded-md"
                onClick={handleLogOut}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-xl">
        Hi {currentUser?.name}! Welcome to your diaries{" "}
        <span className="text-xl">📖</span>
      </p>
      <button className="flex flex-row items-center bg-sky-500 px-2 py-1 mb-2 hover:bg-sky-700">
        <IoAdd size={23} color="white" />
        <p className=" text-white text-lg font-">New diary</p>
      </button>
      <div className=" grid grid-cols-12 bg-white border-[2px] border-gray-50 ">
        <div className="col-span-3 divide-y-[1px] border-r-[1px] border-gray-200">
          {data &&
            data.diaries.map((diary: DiaryCardProps) => {
              return (
                <div
                  className={`p-4 cursor-pointer hover:bg-sky-100 ${
                    diary.diary_id === selectedDiary?.diary_id && "bg-sky-200"
                  }`}
                  onClick={() => handleDiaryClick(diary)}
                >
                  <p className="text-lg">{diary?.title}</p>
                  <p className="text-gray-500 text-xs">
                    {convertDate(diary?.created)}
                  </p>
                </div>
              );
            })}
        </div>
        {selectedDiary && (
          <DiaryCard key={selectedDiary?.diary_id} diary={selectedDiary} />
        )}
      </div>
    </section>
  );
}
