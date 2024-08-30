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
import { CgProfile } from "react-icons/cg";
import DiaryCard, { DiaryCardProps } from "../Components/DiaryCard";
import Sidebar from "../Components/Sidebar";

export default function HomePage() {
  const { currentUser } = useContext(UserContext);
  const [selectedDiary, setSelectedDiary] =
    React.useState<DiaryCardProps | null>(null);

  const queryClient = useQueryClient();

  const fetchDiaries = async () => {
    const response = await fetch(`http://localhost:5000/users/1/diaries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.token}`,
      },
    });
    const data = await response.json();
    return data;
  };
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["diaries"],
    queryFn: fetchDiaries,
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <section id="login" className="bg-sky-image bg-cover min-h-dvh px-[10vw]">
      <div className="pt-10 flex justify-between items-center">
        <h1 className="text-5xl font-semibold text-gray-700"> Dear Diary...</h1>
        <CgProfile size={40} />
      </div>
      <p className="mt-8 text-center text-xl mb-10 ">
        Welcome to your diaries {currentUser?.name}!{" "}
      </p>

      <div className="grid grid-cols-12 bg-white min-h-[70vh] border-[2px] border-gray-50">
        <div className="col-span-3 divide-y-[1px] border-r-[1px] border-gray-200">
          {data &&
            data.diaries.map((diary: DiaryCardProps) => {
              return (
                <div
                  className="bg-white p-4 cursor-pointer hover:bg-sky-100"
                  onClick={() => setSelectedDiary(diary)}
                >
                  <p>{diary?.title}</p>
                  <p>{diary?.created}</p>
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
