import { useNavigate } from "react-router-dom";
import { convertDate } from "../utils/dateTimeConverter.js";
import { MdDeleteForever } from "react-icons/md";
import toast from "react-hot-toast";

export interface DiaryCardProps {
  title: string;
  description: string;
  grateful_for?: string | undefined;
  created: string;
  did_not_go_well?: string | undefined;
  image_url?: string | undefined;
  made_me_smile?: string | undefined;
  user_id?: number;
  diary_id: number;
}

import { BiEdit } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import { deleteDiaryFn } from "../utils/apiCalls.js";
import React, { useContext } from "react";
import { UserContext } from "../App.js";

interface DiaryCardComponentProps {
  diary: DiaryCardProps;
  refetch: () => void;
  setSelectedDiary: React.Dispatch<React.SetStateAction<DiaryCardProps | null>>;
}

export default function DiaryCard({
  diary,
  refetch,
  setSelectedDiary,
}: DiaryCardComponentProps) {
  const navigate = useNavigate();
  const handleEditDiaryClick = (diary: DiaryCardProps) => {
    navigate("/diary", {
      state: diary,
    });
  };

  const { currentUser } = useContext(UserContext);

  const deleteDiaryMutation = useMutation({
    mutationFn: (diary_id: number) => deleteDiaryFn(currentUser, diary_id),
    onSuccess: () => {
      toast.success("Diary deleted successfully");
      refetch();
    },
  });

  const handleDeleteDiaryClick = (diary_id: number) => {
    deleteDiaryMutation.mutate(diary_id);
    setSelectedDiary(null);
  };

  return (
    <div key={diary.diary_id} className="bg-white bg-opacity-80 col-span-9 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">📜 {diary.title}</h1>
        <p className="text-sm text-gray-500">
          {diary.created && convertDate(diary.created)}
        </p>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-8 flex flex-col gap-4 text-balance">
          {diary.grateful_for && (
            <>
              <span className="text-md -mb-4">😇 What am i grateful for?</span>
              <p className="text-md font-light">{diary.grateful_for}</p>
            </>
          )}
          {diary.did_not_go_well && (
            <>
              <span className="text-md -mb-4">😔 What did not go well?</span>
              <p className="text-md font-light">{diary.did_not_go_well}</p>
            </>
          )}
          {diary.made_me_smile && (
            <>
              <span className="text-md -mb-4">😁 What made me smile?</span>
              <p className="text-md font-light">{diary.made_me_smile}</p>
            </>
          )}
          <span className="text-md -mb-4">💬 Details</span>
          <p className="text-md font-light">{diary.description}</p>
        </div>
        {diary.image_url && (
          <div className="col-span-4 rounded-">
            <img
              className="w-[300px] max-h-[300px] object-contain rounded-md"
              src={diary.image_url}
              alt="diary image"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <button
          className=" bg-red-700 px-2 p-1 rounded-md flex gap-1 items-center hover:bg-red-500"
          disabled={deleteDiaryMutation.isPending}
          onClick={() => handleDeleteDiaryClick(diary.diary_id)}
        >
          <MdDeleteForever color="white" size={16} />
          <p className=" text-white -300 mt-[1px]">Delete</p>
        </button>
        <button
          className=" bg-gray-900 px-2 p-1 rounded-md flex gap-1 items-center hover:bg-sky-500"
          onClick={() => handleEditDiaryClick(diary)}
        >
          <BiEdit color="white" size={16} />
          <p className=" text-white -300 mt-[1px]">Edit</p>
        </button>
      </div>
    </div>
  );
}
