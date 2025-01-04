"use client";
import React, { use, useEffect, useState } from 'react'
import Image from 'next/image';
import axios from 'axios';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';

export default function Navbar({Nav_width, Nav_height, Nav_user}: any) {
    const[isopenHamb, setIsopenHamb] = useState(false);
    const[isopenUserProfile, setIsopenUserProfile] = useState(false);
    const[removeX, setRemoveX] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    console.log(width);
    
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

    // useEffect
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        // Cleanup event listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (width > 768) {
            setIsopenHamb(true);
            setRemoveX(true);
        }else {
            setIsopenHamb(false);
            setRemoveX(false);
        }
        console.log("width:", width);
    },[width]);
    
  return (
    <>
        {/* navbar */}
        <div 
        style={{width: Nav_width, height: Nav_height, fontFamily: 'PT Sans', borderColor: '#283618'}}
        className='pl-2 pr-2 border flex justify-between items-center'
        >
            {/* hambergur bar */}
            <div
            className='w-fit h-fit flex 
            flex-col justify-center items-center
            cursor-pointer p-2 hamberger-bar'
            title='Navigation bar'
            style={{
                gap: `${isopenHamb ? '0px' : '8px'}`,
                // visibility: `${isWindowWidth ? 'visible' : 'hidden'}`,
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
                className='bar-1 w-10 h-0.5 bg-black'>
                </div>
                <div 
                style={{
                    display: `${isopenHamb ? 'none' : ''}`,
                    transition: 'all 0.3s ease-in-out',
                }}
                className='bar-2 w-10 h-0.5 bg-black'>
                </div>
                <div 
                style={{
                    rotate: `${isopenHamb ? '-45deg' : '0deg'}`,
                    transition: 'all 0.3s ease-in-out',
                }}
                className='bar-3 w-10 h-0.5 bg-black'>
                </div>
            </div>

            {/* logo */}
            <h1 className='text-4xl'>Rent.in</h1>

            {/* profile */}
            <div 
            className='cursor-pointer w-11 h-11 rounded-full flex justify-center items-center'
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
        className='absolute top-0 left-0 bg-white bg-opacity-5
            backdrop-blur-md h-full 
            flex flex-col justify-start items-start border border-[#283618] border-opacity-20'
            style={{ padding:`${isopenHamb ? '12px' : '0px'}`, width: `${isopenHamb ? '250px' : '0px'}`,
             transition: 'all 0.5s ease-in-out', }}  
        >
            
            <h1 
            className='text-2xl w-full flex justify-end cursor-pointer'
            style={{visibility: `${removeX ? 'hidden' : 'visible'}`}}
            onClick={() => setIsopenHamb((prev) => !prev)}
            >X</h1>

            
            {/* navigation details start from here */}
            <h1
            className='text-2xl transition-all ease-in  font-bold'
            style={{
                fontSize: `${isopenHamb ? '20px' : '0px'}`,
            }}
            >
                Welcome!
                <br />
                <span className='font-normal'>{Nav_user}</span>
                
            </h1>

        </div>

        {/* user profile navigation bar */}
        <div
        className='absolute top-12 right-8
            border w-[150px] bg-white bg-opacity-5
            rounded-md backdrop-blur-sm 
            transition-all ease-in-out duration-500 border-[#283618]
            border-opacity-20 flex flex-col gap-y-2
         '
         style={{
            width: `${isopenUserProfile ? '150px' : '0px'}`,
            height: `${isopenUserProfile ? '100px' : '0px'}`,
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
