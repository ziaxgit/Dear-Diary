interface CurrentUserProps {
  user_id: number;
  token: string;
}
import { DiaryCardProps } from "../Components/DiaryCard";

export const fetchDiariesFn = async (currentUser: CurrentUserProps | null) => {
  const response = await fetch(
    `http://localhost:5000/users/${currentUser?.user_id}/diaries`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const logOutUserFn = async (currentUser: CurrentUserProps | null) => {
  const response = await fetch(`http://localhost:5000/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser?.token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Logout failed");
  }
  return response.json();
};

export const createDiaryFn = async (
  currentUser: CurrentUserProps | null,
  diary: DiaryCardProps
) => {
  const response = await fetch(`http://localhost:5000/diaries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser?.token}`,
    },
    body: JSON.stringify(diary),
  });
  if (!response.ok) {
    throw new Error("Diary creation failed");
  }
  return response.json();
};

export const editDiaryFn = async (
  currentUser: CurrentUserProps | null,
  diary: DiaryCardProps
) => {
  const response = await fetch(
    `http://localhost:5000/diaries/${diary.diary_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.token}`,
      },
      body: JSON.stringify(diary),
    }
  );
  if (!response.ok) {
    throw new Error("Error updating diary");
  }
  return response.json();
};

export const deleteDiaryFn = async (
  currentUser: CurrentUserProps | null,
  diary_id: number
) => {
  const response = await fetch(`http://localhost:5000/diaries/${diary_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser?.token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error deleting diary");
  }
  return response.json();
};
