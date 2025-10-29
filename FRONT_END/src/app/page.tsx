"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import generateRandomNameFromAddress from "@/genUserData/genUserName";
import generateAvatarFromAddress from "@/genUserData/genUserAvatar";
import { useReadUsers, useRegisterUser } from "@/hooks/useUserHooks";
import useUserStore from "@/store/userUserStore";
import { useEffect, useRef, useState } from "react";
import UiButton from "./components/ui/modals/uiButton";
import { useRouter } from "next/navigation";
import LoadingModal from "./components/ui/modals/LoadingModal";
import { useAccount, useConnect } from 'wagmi'

declare global {
  interface Window {
    fc?: {
      user?: {
        fid?: string;
      };
    };
  }
}

export default function Home() {
  const router = useRouter();
   const { address, isConnected } = useAccount();
   const { connectAsync, connectors } = useConnect();
   const {
     register,
     isPending,
     isConfirming,
     isConfirmed,
     error: writeError,
   } = useRegisterUser();
 
   const { setUser } = useUserStore();
   const { userData, isLoading, isRegistered } = useReadUsers();
   const hasRegistered = useRef(false);
 
   const [showModal, setShowModal] = useState(false);
   const [modalMessage, setModalMessage] = useState("");
 
   useEffect(() => {
 
   if (isConnected) initializeUser();
 
     if (isConnected && isLoading) {
       setShowModal(true);
       setModalMessage("Please wait... the sun is warming up!! 🌞");
     } else if ((isConnected && isPending) || isConfirming) {
       setShowModal(true);
       setModalMessage("Please wait while we create your account...");
     } else if ((isConnected && isConfirmed) || writeError) {
       setShowModal(false);
     }
   }, [
     isLoading,
     isPending,
     isConfirming,
     isConfirmed,
     writeError,
     isConnected,
   ]);
 

    console.log("this is address connected :",address)
 
   async function initializeUser() {
     if (isLoading || hasRegistered.current) return;
 
 
     if (!isConnected || !address) {
       toast.info("Connecting wallet...");
       try {
         const injected = connectors.find((c) => c.id === "injected");
         if (!injected) throw new Error("No wallet found");
         const { accounts } = await connectAsync({ connector: injected });
         toast.success(`Connected: ${accounts[0].slice(0, 6)}...`);
         return;
       } catch {
         toast.error("Wallet connection failed");
         return;
       }
     }
 
 
     if (isRegistered && userData) {
       const { name, avatar } = userData;
       setUser(name, avatar);
       toast.success(`Welcome back, ${name}!`);
       setShowModal(false);
       router.push("/discover");
       return;
     }
 
 
     if (!isRegistered && !hasRegistered.current) {
       hasRegistered.current = true;
       const name = generateRandomNameFromAddress(address);
       const avatar = generateAvatarFromAddress(address);
 
       setUser(name, avatar);
       toast.info("New user detected, registering...");
       setShowModal(true);
       setModalMessage("Please wait while we create your account...");
 
       try {
         await register(name, avatar);
         // toast.success(`Welcome, ${name}!`);
         router.push("/userRegistered");
       } catch (err) {
         toast.error("Registration failed");
       } finally {
         setShowModal(false);
       }
     }
   }
 

  // useEffect(() => {

  //   if (isPending) {
  //     setShowModal(true);
  //     setModalMessage("Please wait... the sun is warming up!! 🌞");
  //   } else if (isConfirming) {
  //     setShowModal(true);
  //     setModalMessage("Please wait while we create your account...");
  //   } else if ((isConfirmed) || writeError) {
  //     setShowModal(false);
  //   }
  // }, [
  //   isLoading,
  //   isPending,
  //   isConfirming,
  //   isConfirmed,
  //   writeError,
  //   farcasterId,
  // ]);

  // async function initializeUser() {
  //   if (hasRegistered.current) return;

  //   // if (!farcasterId) {
  //   //   toast.error("Farcaster ID not detected. Please log in.");
  //   //   return;
  //   // }

  //   const farcasterId = Math.floor(Math.random() * 1e12).toString();
  //   console.log(userData);

  //   hasRegistered.current = true;
  //   const name = generateRandomNameFromAddress(farcasterId);
  //   const avatar = generateAvatarFromAddress(farcasterId);

  //   setUser(name, avatar);
  //   toast.info("New user detected, registering...");
  //   setShowModal(true);
  //   setModalMessage("Please wait while we create your account...");

  //   try {
  //     await register(name, avatar);
  //     router.push("/userRegistered");
  //   } catch (err) {
  //     toast.error("Registration failed");
  //   } finally {
  //     setShowModal(false);
  //   }

  //   //   if (isRegistered && userData) {
  //   //     const { name, avatar } = userData;
  //   //     setUser(name, avatar);
  //   //     toast.success(`Welcome back, ${name}!`);
  //   //     setShowModal(false);
  //   //     router.push("/discover");
  //   //     return;
  //   //   }

  //   //   if (!isRegistered && !hasRegistered.current) {
  //   //     hasRegistered.current = true;
  //   //     const name = generateRandomNameFromAddress(farcasterId);
  //   //     const avatar = generateAvatarFromAddress(farcasterId);

  //   //     setUser(name, avatar);
  //   //     toast.info("New user detected, registering...");
  //   //     setShowModal(true);
  //   //     setModalMessage("Please wait while we create your account...");

  //   //     try {
  //   //       await register(name, avatar);
  //   //       router.push("/userRegistered");
  //   //     } catch (err) {
  //   //       toast.error("Registration failed");
  //   //     } finally {
  //   //       setShowModal(false);
  //   //     }
  //   //   }
  // }

  



  return (
    <main className="bg-white w-full h-screen relative flex flex-col items-center justify-center mt-6">
      <Image
        className="w-full p-6 h-auto md:max-w-md"
        src="/hero.png"
        alt="Group"
        width={458}
        height={446}
      />

      <div className="my-4">
        <UiButton text="Get Started" onClick={() => initializeUser()} />
      </div>

      <section className="flex flex-col  items-center absolute bottom-3 justify-center">
        <h1 className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-[#0711331a] items-center justify-center text-2xl tracking-[0] leading-[normal]">
          Talk. Heal. Grow.
        </h1>

        <h1 className="text-[#071133] relative self-stretch mt-[-17px] [font-family:'Poppins',Helvetica] font-semibold text-2xl tracking-[0] leading-[normal]">
          Talk. Heal. Grow.
        </h1>

        <h1 className="text-[#0711331a] relative self-stretch mt-[-17px] [font-family:'Poppins',Helvetica] font-semibold text-2xl tracking-[0] leading-[normal]">
          Talk. Heal. Grow.
        </h1>
      </section>
      {/* 🔥 Registration progress modal */}
      <LoadingModal show={showModal} message={modalMessage} />
    </main>
  );
}
