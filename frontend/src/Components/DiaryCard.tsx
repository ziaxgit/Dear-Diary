import React from "react";

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

export default function DiaryCard({ diary }: { diary: DiaryCardProps }) {
  console.log(diary);
  return (
    <div key={diary.diary_id} className="bg-white bg-opacity-80 col-span-9 p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl">{diary.title}</h1>
        <p className="text-md">{diary.created}</p>
      </div>
      <div>
        <div className="flex gap-4 flex-wrap ">
          <div className="flex flex-col justify-between gap-2">
            <img
              className="w-[300px] max-h-[300px] object-contain"
              src={diary.image_url}
              alt="diary image"
            />
            <span className="text-lg -mb-2">What am i grateful for? 😇</span>
            <p className="text-lg font-light">{diary.grateful_for}</p>
            <span className="text-lg -mb-2">What did not go well? 😔 </span>
            <p className="text-lg font-light">{diary.did_not_go_well}</p>
            <span className="text-lg -mb-2">What made me smile? 😁</span>
            <p className="text-lg font-light">{diary.made_me_smile}</p>
            <span className="text-lg -mb-2">More details about my day 💬</span>
            <p className="text-lg font-light">{diary.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
