import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Title from "./Title";
import Subtitle from "./Subtitle";

const postFormSchema = z.object({
  title: z.string().min(2, { message: "Please enter a title" }),
  description: z.string().min(2, {
    message: "Please enter a valid email",
  }),
});

type PostDataType = z.infer<typeof postFormSchema>;

export default function PostForm() {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<PostDataType>({
    resolver: zodResolver(postFormSchema),
  });

  return (
    <section
      id="new-diary"
      className="bg-sky-image bg-cover min-h-dvh px-[10vw]"
    >
      <div className="text-center pt-5">
        <Title />
        <Subtitle />
      </div>
      <p className="text-center mt-8 mb-2">Write your heart out</p>
      <div className="flex justify-center gap-12   ">
        <form className="">
          <div className="flex flex-col w-full lg:w-[500px]">
            <label>Title for this day</label>
            <input
              {...register("title")}
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              type="text"
              placeholder="Enter a title for this day"
            />
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[500px]">
            <label>What am I grateful for?</label>
            <input
              {...register("title")}
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              type="text"
              placeholder="Enter a title for this day"
            />
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[500px]">
            <label>What made me smile?</label>
            <input
              {...register("title")}
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              type="text"
              placeholder="Enter a title for this day"
            />
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[500px]">
            <label>What did not go well?</label>
            <input
              {...register("title")}
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              type="text"
              placeholder="Enter a title for this day"
            />
          </div>
          <div className="flex flex-col gap-1 w-full md:w-[500px]">
            <label>Detailed description</label>
            <textarea
              rows={5}
              {...register("title")}
              className="p-2 border-[1px] border-gray-600 rounded-md
            "
              placeholder="Enter a title for this day"
            />
          </div>
        </form>
      </div>
    </section>
  );
}
