import { useNavigate } from "react-router-dom";
import { convertDate } from "../utils/dateTimeConverter.js";

export interface DiaryCardProps {
  title: string;
  description: string;
  grateful_for: string;
  created: string;
  did_not_go_well: string;
  image_url: string;
  made_me_smile: string;
  learned: string;
  user_id: number;
  diary_id: number;
}

import { BiEdit } from "react-icons/bi";

export default function DiaryCard({ diary }: { diary: DiaryCardProps }) {
  const navigate = useNavigate();
  const handleEditDiaryClick = (diary: DiaryCardProps) => {
    navigate("/diary", {
      state: diary,
    });
  };
  return (
    <div key={diary.diary_id} className="bg-white bg-opacity-80 col-span-9 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">{diary.title}</h1>
        <p className="text-sm text-gray-500">{convertDate(diary.created)}</p>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-8 flex flex-col gap-4">
          <span className="text-md -mb-4">What am i grateful for? 😇</span>
          <p className="text-md font-light">{diary.grateful_for}</p>
          <span className="text-md -mb-4">What did not go well? 😔 </span>
          <p className="text-md font-light">{diary.did_not_go_well}</p>
          <span className="text-md -mb-4">What made me smile? 😁</span>
          <p className="text-md font-light">{diary.made_me_smile}</p>
          <span className="text-md -mb-4">More details about my day 💬</span>
          <p className="text-md font-light">{diary.description}</p>
        </div>
        <div className="col-span-4">
          <img
            className="w-[300px] max-h-[300px] object-contain"
            src={diary.image_url}
            alt="diary image"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4 ">
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
