import Title from "./Title";
import Subtitle from "./Subtitle";
import { PiSmileySad } from "react-icons/pi";

export default function ErrorPage() {
  return (
    <section
      id="error"
      className="bg-sky-image bg-cover min-h-screen px-[10vw]"
    >
      <div className="-mt-5 pt-5 text-center">
        <Title />
        <Subtitle />
      </div>
      <div className="flex justify-center items-center mt-10 gap-2">
        <PiSmileySad className="text-8xl text-center" />
        <p className="text-3xl">404 PAGE NOT FOUND</p>
      </div>
      <div className="text-center mt-10">
        <p className="text-xl mb-2">Uh oh.. you seem to be lost.</p>
        <p className="text-xl">
          Please{" "}
          <a href="/login" className="text-blue-600 font-medium">
            Log In
          </a>
        </p>
      </div>
    </section>
  );
}
