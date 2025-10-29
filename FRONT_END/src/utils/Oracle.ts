// import { usePublicClient, useWriteContract } from "wagmi";
// import abi from "@/abi/CounselorVerification.json";

// const CONTRACT_ADDRESS = "0xYourContractAddress";

// const VERIFICATION_URIS = {
//   0: "https://api.nigeriahealth.gov.ng/psychiatrists",
//   1: "https://api.nigeriahealth.gov.ng/therapists",
//   2: "https://api.nigeriahealth.gov.ng/counselors"
// };

// export const useAutoVerifyCounselor = () => {
//   const publicClient = usePublicClient();
//   const { writeContractAsync } = useWriteContract();

//   const startListening = async () => {
//     publicClient.watchContractEvent({
//       address: CONTRACT_ADDRESS,
//       abi,
//       eventName: "CounselorRegistered",
//       onLogs: async (logs) => {
//         for (const log of logs) {
//           const counselorAddress = log.args.counselor;
//           console.log("👂 New counselor registered:", counselorAddress);

//           // 1️⃣ Fetch counselor details from contract
//           const counselor = await publicClient.readContract({
//             address: CONTRACT_ADDRESS,
//             abi,
//             functionName: "getCounselor",
//             args: [counselorAddress],
//           });

//           const specialization = Number(counselor.specialization);
//           const registrationNumber = counselor.registrationNumber;
//           const uri = VERIFICATION_URIS[specialization];

//           console.log("🔍 Checking verification for:", registrationNumber);

//           // 2️⃣ Call external verification API
//           const res = await fetch(`${uri}?regNo=${registrationNumber}`);
//           const data = await res.json();

//           if (data.isValid) {
//             console.log("✅ Verified. Updating onchain...");
//             await writeContractAsync({
//               address: CONTRACT_ADDRESS,
//               abi,
//               functionName: "verifyCounselor",
//               args: [counselorAddress, true],
//             });
//           } else {
//             console.warn("❌ Verification failed for:", registrationNumber);
//           }
//         }
//       },
//     });
//   };

//   return { startListening };
// };
