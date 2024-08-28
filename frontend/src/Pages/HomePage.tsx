import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export default function HomePage() {

  const queryClient = useQueryClient();

  const fetchDiaries = async () => {
    const response = await fetch(`http://localhost:5000/users/${userId}/diaries`);
    const data = await response.json();
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['diaries'],
    queryFn: fetchDiaries,
  })

  return (
    <section
      id="login"
      className="bg-sky-image bg-cover flex flex-col items-center min-h-dvh"
    >
      <h1 className="text-5xl font-semibold text-gray-700 mt-10">
        {" "}
        Dear Diary...
      </h1>
    </section>
  );
}
