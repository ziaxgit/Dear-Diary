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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">{diary.title}</h1>
        <p className="text-md">{diary.created}</p>
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
    </div>
  );
}
