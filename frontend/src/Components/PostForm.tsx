import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { DiaryCardProps } from "./DiaryCard";
import ProfileDropdown from "./ProfileDropdown";
import { UserContext } from "../App";
import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { createDiaryFn, editDiaryFn } from "../utils/apiCalls.js";

const postFormSchema = z.object({
  title: z.string().min(2, { message: "Please enter a title" }),
  description: z.string().min(2, { message: "Please enter more details" }),
  grateful_for: z.string().optional(),
  did_not_go_well: z.string().optional(),
  image_url: z.string().optional(),
  made_me_smile: z.string().optional(),
  diary_id: z.number().optional(),
});

type PostDataType = z.infer<typeof postFormSchema>;

export default function PostForm() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostDataType>({
    resolver: zodResolver(postFormSchema),
  });

  const { state }: { state: DiaryCardProps } = useLocation();

  const handleGoBackClick = () => {
    navigate("/home");
  };
  const postDiaryMutation = useMutation({
    mutationFn: (diary: DiaryCardProps) => createDiaryFn(currentUser, diary),
    onSuccess: () => {
      toast.success("Diary created successfully");
      navigate("/home");
    },
    onError: (error) => {
      toast.error(error?.message);
      navigate("/home");
    },
  });

  const editDiaryMutation = useMutation({
    mutationFn: (diary: DiaryCardProps) => editDiaryFn(currentUser, diary),
    onSuccess: () => {
      toast.success("Diary updated successfully");
      navigate("/home");
    },
    onError: (error) => {
      toast.error(error?.message);
      navigate("/home");
    },
  });

  console.log(errors);

  const onSubmit: SubmitHandler<PostDataType> = async (diary) => {
    const diaryWithUserId = { ...diary, user_id: currentUser?.user_id };
    console.log(diaryWithUserId);
    if (state) {
      diaryWithUserId.diary_id = state.diary_id;
      editDiaryMutation.mutate(diaryWithUserId);
    } else {
      postDiaryMutation.mutate(diaryWithUserId);
    }
    console.log("Submit clicked...");
  };

  return (
    <section
      id="new-diary"
      className="bg-sky-image bg-cover min-h-dvh px-[10vw]"
    >
      <ProfileDropdown currentUser={currentUser} />
      <p className="text-center mt-6 mb-2">Write your heart out</p>
      <div className="flex justify-center gap-12">
        <form
          className="flex flex-col gap-1 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-full lg:w-[500px]">
            <label className="font-">Title for this day</label>
            <textarea
              rows={1}
              {...register("title")}
              defaultValue={state?.title}
              className="p-2 border-[1px] border-gray-600 rounded-md font-light
            "
              placeholder="Title..."
            />
            {errors.title && (
              <p className="text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[500px]">
            <label className="font-">What am I grateful for?</label>

            <textarea
              defaultValue={state?.grateful_for}
              {...register("grateful_for")}
              className="p-2 border-[1px] border-gray-600 rounded-md font-light
            "
              placeholder="Grateful for..."
            />
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[500px]">
            <label className="font-">What made me smile?</label>
            <textarea
              defaultValue={state?.made_me_smile}
              {...register("made_me_smile")}
              className="p-2 border-[1px] border-gray-600 rounded-md font-light
            "
              placeholder="Made me smile..."
            />
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[500px]">
            <label className="font-">What did not go well?</label>
            <textarea
              defaultValue={state?.did_not_go_well}
              {...register("did_not_go_well")}
              className="p-2 border-[1px] border-gray-600 rounded-md font-light
            "
              placeholder="Did no go well..."
            />
          </div>
          <div className="flex flex-col gap-1 w-full md:w-[500px]">
            <label className="font-">Detailed description</label>
            <textarea
              rows={2}
              defaultValue={state?.description}
              {...register("description")}
              className="p-2 border-[1px] border-gray-600 rounded-md font-light
            "
              placeholder="Details..."
            />
            {errors.description && (
              <p className="text-red-600">{errors.description.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full md:w-[500px]">
            <label className="font-">Image URL</label>
            <input
              defaultValue={state?.image_url}
              {...register("image_url")}
              className="p-2 border-[1px] border-gray-600 rounded-md font-light
            "
              placeholder="Image url..."
            />
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={handleGoBackClick}
              className="bg-gray-100 text-gray-800 py-1 px-2 rounded hover:bg-gray-300"
            >
              Go back
            </button>
            <button
              disabled={isSubmitting}
              className="bg-sky-500 py-1 rounded px-8 hover:bg-sky-600 text-gray-900"
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
