"use client";
import React, { use, useEffect, useState } from 'react'
import Image from 'next/image';
import axios from 'axios';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar({Nav_user}: any) {
    const[isopenHamb, setIsopenHamb] = useState(false);
    const[isopenUserProfile, setIsopenUserProfile] = useState(false);
    const[displayText, setDisplayText] = useState(false);
    const router = useRouter();
    
    // functions
    async function logout() {
        try {
            await axios.get("/api/logout");
            signOut();
            router.push("/login");

        } catch (error: any) {
            console.log("logout failed (frontend)", error);
        }
    }

    useEffect(()=> {
        if(isopenHamb) {
            setTimeout(() => {
                setDisplayText((prev) => !prev)
            }, 400);
        }else {
            setDisplayText((prev) => !prev)
        }
    },[isopenHamb])
    
    
  return (
    <>
        {/* navbar */}
        <div 
        className='w-full h-full pl-2 pr-2 border
         border-black border-opacity-15 
         flex justify-between items-center'
        >
            {/* hambergur bar */}
            <div
            className='w-fit h-fit flex 
            flex-col justify-center items-center
            cursor-pointer p-2 hamberger-bar'
            title='Navigation bar'
            style={{
                gap: `${isopenHamb ? '0px' : '8px'}`,
            }}
            onClick={() => setIsopenHamb((prev) => !prev)}
            >
                <div 
                
                style={
                    {
                        rotate: `${isopenHamb ? '45deg' : '0deg'}`,
                        transition: 'all 0.3s ease-in-out',
                    }
                }
                className='bar-1 w-8 lg:w-10 h-0.5 bg-black'>
                </div>
                <div 
                style={{
                    display: `${isopenHamb ? 'none' : ''}`,
                    transition: 'all 0.3s ease-in-out',
                }}
                className='bar-2 w-8 lg:w-10 h-0.5 bg-black'>
                </div>
                <div 
                style={{
                    rotate: `${isopenHamb ? '-45deg' : '0deg'}`,
                    transition: 'all 0.3s ease-in-out',
                }}
                className='bar-3 w-8 lg:w-10 h-0.5 bg-black'>
                </div>
            </div>

            {/* logo */}
            <h1 className="font-semibold text-3xl md:text-4xl lg:text-5xl xl:text-5xl  ">Rent.in</h1>

            {/* profile */}
            <div 
            className='cursor-pointer w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full flex justify-center items-center'
            title='Profile'
            onClick={() => setIsopenUserProfile((prev) => !prev )}
            >
                <Image
                  src="/userIcon1.png"
                  alt="Google Sign-In"
                  width={50}
                  height={50}
                />
            </div>
           
        </div>



    {/*--------------position absolute------------- */}

        {/* left navigation bar */}
        <div 
        className={`absolute top-0 left-0 bg-white bg-opacity-15 backdrop-blur-md h-full z-10 flex flex-col justify-start items-start border border-[#283618] border-opacity-20 ${isopenHamb ? 'p-3' : 'p-0'} ${
            isopenHamb ? 'w-72' : 'w-0'
          } sm:w-40 md:w-72 lg:w-112 xl:w-96 `}
            style={{ padding:`${isopenHamb ? '12px' : '0px'}`, width: `${isopenHamb ? '300px' : '0px'}`,
             transition: 'all 0.5s ease-in-out', }}  
        >
            
            <h1 
            className='text-2xl w-full flex justify-end cursor-pointer'
            onClick={() => setIsopenHamb((prev) => !prev)}
            >X</h1>

            
            {/* navigation details start from here */}
            <h1
            className='text-xl md:text-2xl lg:text-3xl xl:text-4xl 
            mb-3 md:mb-4 lg:mb-5 xl:mb-6 transition-all ease-in  '
            style={{
                display: `${displayText ? 'block' : 'none'}`,
            }}
            >
                Welcome!
                <br />
                <span className='font-bold'>{Nav_user}</span>
                
            </h1>

            <div className='w-full flex flex-col gap-y-2'>

                <div
                className='w-full p-2 cursor-pointer backdrop-blur-sm 
                bg-white bg-opacity-40 rounded-md text-center
                 md:text-xl '
                style={{
                    display: `${displayText ? 'block' : 'none'}`,
                }}
                >
                    <Link href="/dashboard">Dashboard</Link>
                </div>

                <div
                className='w-full p-2 cursor-pointer backdrop-blur-sm 
                bg-white bg-opacity-40 rounded-md text-center
                 md:text-xl '
                style={{
                    display: `${displayText ? 'block' : 'none'}`,
                }}
                // onClick={}
                >
                    <Link href="/create-new-rent">Create New Rent</Link>
                </div>

                <div
                className='w-full p-2 cursor-pointer backdrop-blur-sm 
                bg-white bg-opacity-40 rounded-md text-center
                md:text-xl'
                style={{
                    display: `${displayText ? 'block' : 'none'}`,
                }}
                // onClick={}
                >
                    <Link href="/all-properties">All Properties</Link>
                </div>

                <div
                className='w-full p-2 cursor-pointer backdrop-blur-sm 
                bg-white bg-opacity-40 rounded-md text-center
                md:text-xl '
                style={{
                    display: `${displayText ? 'block' : 'none'}`,
                }}
                // onClick={}
                >
                    <Link href="/add-maintanence">Add Maintanence</Link>
                </div>

                <div
                className='w-full p-2 cursor-pointer backdrop-blur-sm 
                bg-white bg-opacity-40 rounded-md text-center
                md:text-xl'
                style={{
                    display: `${displayText ? 'block' : 'none'}`,
                }}
                // onClick={}
                >
                    <Link href="/add-expense">Add Expense</Link>
                </div>

                <div
                className='w-full p-2 cursor-pointer backdrop-blur-sm 
                bg-white bg-opacity-40 rounded-md text-center
                md:text-xl '
                style={{
                    display: `${displayText ? 'block' : 'none'}`,
                }}
                // onClick={}
                >
                    <Link href='/revenue'>Revenue</Link>
                </div>

                <div
                className='w-full p-2 cursor-pointer backdrop-blur-sm 
                bg-black text-white bg-opacity-60 rounded-md text-center
                md:text-xl '
                style={{
                    display: `${displayText ? 'block' : 'none'}`,
                }}
                onClick={logout}
                >
                    Logout
                </div>

            </div>
            

        </div>

        {/* user profile navigation bar */}
        <div
        className='absolute top-[70px] right-0
            md:top-[90px] lg:top-[100px] xl:top-[70px]
            border w-40 bg-white bg-opacity-15
            rounded-md backdrop-blur-sm z-10
            transition-all ease-in-out duration-500 border-[#283618]
            border-opacity-20 flex flex-col gap-y-2
         '
         style={{
             width: `${isopenUserProfile ? '180px' : '0px'}`,
             height: `${isopenUserProfile ? '120px' : '0px'}`,
             padding: `${isopenUserProfile ? '7px' : '0px'}`,
         }}
        >
            <div
            className=' w-full h-1/2 bg-[#DDA15E] rounded-md
            bg-opacity-50 flex justify-center items-center cursor-pointer'
            style={{display: `${isopenUserProfile ? 'flex' : 'none'}`}}
            >
                <div
                className='transition-all ease-in-out delay-500 duration-500'
                title='User Profile'
                style={{
                    fontSize: `${isopenUserProfile ? '16px':'0px'}`,
                }}
                >
                   User Profile 
                </div>
            </div>

            <div
            className=' w-full h-1/2 bg-black rounded-md
             flex justify-center items-center cursor-pointer'
             title='Logout'
             style={{display: `${isopenUserProfile ? 'flex' : 'none'}`}}
             onClick={logout}
            
            >
                <Image
                src={"/logoutIconWhite.png"}
                width={15}
                height={15}
                alt='l'
                className='bg-transparent text-white'
                >
                </Image>
                <div
                className='transition-all ease-in-out 
                duration-500 flex justify-center gap-x-2 text-white'
                style={{
                    fontSize: `${isopenUserProfile ? '16px':'0px'}`,
                }}
                >
                    Logout
                </div>
            </div>

        </div>
    </>
  )
}