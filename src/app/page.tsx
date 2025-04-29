import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };
  return (
    <>
      <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6"
      // style={{background: style.background}}
      >
      {/* Navbar */}
      <nav className="w-full max-w-7xl flex justify-between items-center py-6">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-sm">
            <Image 
            src={"/falcon3-9.png"}
            className="invert h-auto w-auto"
            width={30}
            height={5}
            alt="logo"
            priority
            ></Image>

          </div>
          <h1 className="text-2xl font-bold text-gray-800">Rent.in</h1>
        </div>
        {/* <div className="flex space-x-6 text-gray-700 font-medium">
          <button className="hover:text-blue-600">Find Houses</button>
          <button className="hover:text-blue-600">Post Property</button>
        </div> */}
      </nav>

      {/* Main Section */}
      <main className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mt-10">
        {/* Left Section */}
        <div className="flex flex-col space-y-6 max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Manage Rent records on your fingertip
          </h2>
          <p className="text-gray-600 text-lg">
            Easy management of your expenses, maintenance, properties and tenants.
          </p>

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <Link 
            href={"/login"}
            className="px-6 py-3 bg-white border-2 border-black text-black font-semibold rounded-lg hover:bg-gray-100 transition">
              Login
            </Link>
            <Link 
            href={"/signup"}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Sign up
            </Link>
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="mt-10 md:mt-0">
          <Image
            src="/Picsart_25-04-28_22-08-19-215.png"
            alt="Man working illustration"
            // className="h-auto w-auto"
            width={500}
            height={500}
            priority

          />
        </div>
      </main>
    </div>
    </>
  );
}
