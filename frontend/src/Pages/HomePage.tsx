import React from "react";
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

export default function HomePage() {
  const { currentUser } = useContext(UserContext);

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

  console.log(data);

  return (
    <section id="login" className="bg-sky-image bg-cover min-h-dvh px-[10vw]">
      <div className="pt-10 flex justify-between items-center">
        <h1 className="text-5xl font-semibold text-gray-700"> Dear Diary...</h1>
        <CgProfile size={40} />
      </div>
      <p className="mt-8 text-center text-xl mb-10">
        Welcome to your diaries {currentUser?.name}!{" "}
      </p>
      {isPending && <p>Loading...</p>}
      {isError && <p>Error: {error.message}</p>}
      {data &&
        data.diaries.map((diary: DiaryCardProps) => {
          return <DiaryCard key={diary.diary_id} diary={diary} />;
        })}
    </section>
  );
}
