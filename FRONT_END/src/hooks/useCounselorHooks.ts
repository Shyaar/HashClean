import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { toast } from "react-toastify";
import counselorABI from "../abi/counselorRegister.json";

// ----- Types -----
export type Counselor = {
  id: number;
  name: string;
  specialization: number;
  verified: boolean;
  registrationNumber: string;
};

export type RawCounselor = {
  id: string | number;
  name: string;
  specialization: string | number;
  verified: boolean;
  registrationNumber: string;
};

// ----- Register Counselor Hook -----
export function useRegisterCounselor() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CREGIS_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: hash,
    writeContractAsync,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const registerCounselor = async (
    name: string,
    specialization: number,
    registrationNumber: string
  ) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first!");
      throw new Error("Wallet not connected");
    }
    if (!contractAddress) {
      toast.error("Contract address missing");
      throw new Error("Contract address missing");
    }

    console.log("🟢 [RegisterCounselor] Registering...", {
      name,
      specialization,
      registrationNumber,
    });
    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: counselorABI,
        functionName: "counselorRegistration",
        args: [name, specialization, registrationNumber],
      });

      toast.info("⏳ Transaction sent... waiting for confirmation");
      console.log("📦 [Tx Sent] Hash:", tx);
      return tx;
    } catch (err: unknown) {
      console.error("🔴 [RegisterCounselor] Failed:", err);
      toast.error("Failed to register counselor.");
      throw err;
    }
  };

  return {
    registerCounselor,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  };
}

// ----- Read All Counselors -----
export function useReadAllCounselors() {
  const contractAddress = process.env.NEXT_PUBLIC_CREGIS_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: counselorsData,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: counselorABI,
    functionName: "getAllCounselors",
  });

  const counselors: Counselor[] = Array.isArray(counselorsData)
    ? counselorsData.map((c: RawCounselor) => ({
        id: Number(c.id),
        name: c.name,
        specialization: Number(c.specialization),
        verified: c.verified,
        registrationNumber: c.registrationNumber,
      }))
    : [];

  return { counselors, isLoading, isError, refetch };
}

// ----- Read Specific Counselor -----
export function useReadCounselor(counselorAddress: `0x${string}`) {
  const contractAddress = process.env.NEXT_PUBLIC_CREGIS_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: counselorData,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: counselorABI,
    functionName: "getCounselor",
    args: [counselorAddress],
    query: { enabled: !!counselorAddress },
  });

  const counselor: Counselor | null = counselorData
    ? {
        id: Number((counselorData as RawCounselor).id),
        name: (counselorData as RawCounselor).name,
        specialization: Number((counselorData as RawCounselor).specialization),
        verified: (counselorData as RawCounselor).verified,
        registrationNumber: (counselorData as RawCounselor).registrationNumber,
      }
    : null;

  return { counselor, isLoading, isError, refetch };
}

// ----- Verify Counselor Hook -----
export function useVerifyCounselor() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CREGIS_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: hash,
    writeContractAsync,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const verifyCounselor = async (counselorAddress: `0x${string}`) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first!");
      throw new Error("Wallet not connected");
    }
    if (!contractAddress) {
      toast.error("Contract address missing");
      throw new Error("Contract address missing");
    }

    console.log("🟢 [VerifyCounselor] Verifying counselor...", {
      counselorAddress,
    });

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: counselorABI,
        functionName: "verifyCounselor",
        args: [counselorAddress],
      });
      toast.info("⏳ Transaction sent... waiting for confirmation");
      console.log("📦 [Tx Sent] Hash:", tx);
      return tx;
    } catch (err: unknown) {
      console.error("🔴 [VerifyCounselor] Failed:", err);
      toast.error("Failed to verify counselor.");
      throw err;
    }
  };

  return {
    verifyCounselor,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  };
}
