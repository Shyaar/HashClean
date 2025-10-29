// "use client";

// import { useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { useAccount, useConnect } from "wagmi";
// import { useRouter } from "next/navigation";
// import useUserStore from "../../../store/userUserStore";
// import { useReadUsers, useRegisterUser } from "../../../hooks/useUserHooks";
// import ConnectButton from "../ui/buttons/connetWallet";
// import generateRandomNameFromAddress from "@/genUserData/genUserName";
// import generateAvatarFromAddress from "@/genUserData/genUserAvatar";


// import LoadingModal from "../ui/modals/LoadingModal";

// export default function Nav() {
//   const router = useRouter();
//   const { address, isConnected } = useAccount();
//   const { connectAsync, connectors } = useConnect();
//   const {
//     register,
//     isPending,
//     isConfirming,
//     isConfirmed,
//     error: writeError,
//   } = useRegisterUser();

//   const { setUser } = useUserStore();
//   const { userData, isLoading, isRegistered } = useReadUsers();
//   const hasRegistered = useRef(false);

//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   useEffect(() => {

//   if (isConnected) initializeUser();

//     if (isConnected && isLoading) {
//       setShowModal(true);
//       setModalMessage("Please wait... the sun is warming up!! 🌞");
//     } else if ((isConnected && isPending) || isConfirming) {
//       setShowModal(true);
//       setModalMessage("Please wait while we create your account...");
//     } else if ((isConnected && isConfirmed) || writeError) {
//       setShowModal(false);
//     }
//   }, [
//     isLoading,
//     isPending,
//     isConfirming,
//     isConfirmed,
//     writeError,
//     isConnected,
//   ]);


//   async function initializeUser() {
//     if (isLoading || hasRegistered.current) return;


//     if (!isConnected || !address) {
//       toast.info("Connecting wallet...");
//       try {
//         const injected = connectors.find((c) => c.id === "injected");
//         if (!injected) throw new Error("No wallet found");
//         const { accounts } = await connectAsync({ connector: injected });
//         toast.success(`Connected: ${accounts[0].slice(0, 6)}...`);
//         return;
//       } catch {
//         toast.error("Wallet connection failed");
//         return;
//       }
//     }


//     if (isRegistered && userData) {
//       const { name, avatar } = userData;
//       setUser(name, avatar);
//       toast.success(`Welcome back, ${name}!`);
//       setShowModal(false);
//       router.push("/discover");
//       return;
//     }


//     if (!isRegistered && !hasRegistered.current) {
//       hasRegistered.current = true;
//       const name = generateRandomNameFromAddress(address);
//       const avatar = generateAvatarFromAddress(address);

//       setUser(name, avatar);
//       toast.info("New user detected, registering...");
//       setShowModal(true);
//       setModalMessage("Please wait while we create your account...");

//       try {
//         await register(name, avatar);
//         // toast.success(`Welcome, ${name}!`);
//         router.push("/userRegistered");
//       } catch (err) {
//         toast.error("Registration failed");
//       } finally {
//         setShowModal(false);
//       }
//     }
//   }

//   return (
//     <>
//       <header className="border-b border-gray-400">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <img
//                 className="w-[50px] h-[50px]"
//                 src="/logo.png"
//                 alt="Novana Logo"
//               />
//               <div>
//                 <h1 className="text-xl font-bold">Novana</h1>
//                 <p className="text-xs">You should never walk alone</p>
//               </div>
//             </div>

//             <div>
//               <ConnectButton />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* 🔥 Registration progress modal */}
//       <LoadingModal show={showModal} message={modalMessage} />
//     </>
//   );
// }
