interface CurrentUserProps {
  user_id: number;
  token: string;
}

export const fetchDiaries = async (currentUser: CurrentUserProps | null) => {
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
