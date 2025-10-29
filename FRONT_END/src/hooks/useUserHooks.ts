import {
  useReadContract,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import registerUserABI from "../abi/registerUser.json";
import { toast } from "react-toastify";

export type User = {
  name: string;
  avatar: string;
};

export type RawUser = {
  name: string;
  avatar: string;
};

export function useReadUsers() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_UREGIS_CONTRACT_ADDRESS as `0x${string}`;

  // ✅ Check if current user has registered
  const isRegisteredRead = useReadContract({
    address: contractAddress,
    abi: registerUserABI,
    functionName: "getUserHasRegistered",
    args: [address],
  });

  // ✅ Get current user info
  const userRead = useReadContract({
    address: contractAddress,
    abi: registerUserABI,
    functionName: "users",
    args: [address],
  });

  // ✅ Get all users (index-based)
  const allUsersRead = useReadContract({
    address: contractAddress,
    abi: registerUserABI,
    functionName: "allUsers",
    args: [0], // if you have dynamic count, you'll need to loop or fetch length first
  });

  let userData: User | undefined = undefined;
  const userDataRaw = userRead.data;

  if (Array.isArray(userDataRaw) && userDataRaw.length === 2) {
    userData = { name: userDataRaw[0], avatar: userDataRaw[1] };
  } else if (userDataRaw && typeof userDataRaw === "object" && "name" in userDataRaw) {
    userData = userDataRaw as User;
  }

  return {
    address,
    isConnected,
    isRegistered: Boolean(isRegisteredRead.data),
    userData,
    isLoading: userRead.isLoading || isRegisteredRead.isLoading || allUsersRead.isLoading,
    isError: userRead.isError || isRegisteredRead.isError || allUsersRead.isError,
    refetchUser: userRead.refetch,
    refetchStatus: isRegisteredRead.refetch,
    refetchAll: allUsersRead.refetch,
  };
}

export function useRegisterUser() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_UREGIS_CONTRACT_ADDRESS as `0x${string}`;

  const { data: hash, writeContractAsync, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const register = async (name: string, avatar: string) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first!");
      throw new Error("Wallet not connected");
    }

    if (!contractAddress) {
      toast.error("Contract address not found in env file");
      throw new Error("Contract address missing");
    }

    console.log("🟢 [RegisterUser] Starting registration...", { name, avatar });

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: registerUserABI,
        functionName: "userRegistration",
        args: [name, avatar],
      });

      toast.info("⏳ Transaction sent... waiting for confirmation");
      console.log("📦 [Tx Sent] Hash:", tx);

      return tx;
    } catch (err: unknown) {
      console.error("🔴 [RegisterUser] Failed:", err);
      toast.error("Registration failed.");
      throw err;
    }
  };

  return {
    register,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  };
}
