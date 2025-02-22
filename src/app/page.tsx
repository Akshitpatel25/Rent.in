import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };
  return (
    <>
      <div
        style={{ background: style.background }}
        className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto"
      >
        <div
        className="w-full h-1/6 flex gap-x-4 border justify-center items-end text-5xl font-bold "
        >
          <Image
          src={"/falcon3.ico"}
          alt="logo"
          width={70}
          height={70}
          >

          </Image>
          <h1>Rent.in</h1>
        </div>
        <div
        className="w-full h-5/6 flex justify-center items-center text-3xl font-bold gap-x-2 "
        >
            
        <Link href="/login" className="p-2 bg-white rounded-md">Login</Link>
        <Link href="/signup" className="p-2 bg-black text-white rounded-md">signup</Link>
        </div>

      </div>
    </>
  );
}
