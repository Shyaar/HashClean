import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { BaseError } from "viem";
import { toast } from "react-toastify";
import novanaABI from "../abi/novana.json";

export type Room = {
  id: number;
  topic: string;
  creator: string;
  isPrivate: boolean;
  memberCount: number;
  farcasterChannelId: string;
};

export type RawRoom = {
  id: string | number;
  topic: string;
  creator: string;
  isPrivate: boolean;
  memberCount: string | number;
  farcasterChannelId: string;
};

// ----- Create Room -----
export function useCreateRoom() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_NOVANA_M_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: hash,
    writeContractAsync,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const createRoom = async (topic: string, isPrivate: boolean) => {
    console.log("🟢 [CreateRoom] Hook initialized with:", {
      address,
      isConnected,
      contractAddress,
    });

    if (!isConnected) {
      toast.error("Please connect your wallet first!");
      console.error("🔴 [CreateRoom] Wallet not connected");
      throw new Error("Wallet not connected");
    }

    if (!contractAddress) {
      toast.error("Contract address missing");
      console.error("🔴 [CreateRoom] Contract address missing");
      throw new Error("Contract address missing");
    }

    console.log("🟢 [CreateRoom] Creating room with:", { topic, isPrivate });

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: novanaABI,
        functionName: "createRoom",
        args: [topic, isPrivate],
      });

      toast.info("⏳ Transaction sent... waiting for confirmation");
      console.log("📦 [Tx Sent] Hash:", tx);

      return tx;
    } catch (err) {
      console.error("🔴 [CreateRoom] Failed:", err);
      toast.error("Failed to create room.");
      throw err;
    }
  };

  return {
    createRoom,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  };
}

// ----- Read All Rooms -----
export function useReadRooms() {
  const contractAddress = process.env
    .NEXT_PUBLIC_NOVANA_M_CONTRACT_ADDRESS as `0x${string}`;


  const {
    data: roomsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: novanaABI,
    functionName: "getAllRooms",
  });



  let rooms: Room[] = [];

  if (Array.isArray(roomsData)) {
    rooms = roomsData.map((r: RawRoom, i: number) => {

      return {
        id: Number(r.id),
        topic: r.topic,
        creator: r.creator,
        isPrivate: r.isPrivate,
        memberCount: Number(r.memberCount),
        farcasterChannelId: r.farcasterChannelId,
      };
    });
  } else {
 
  }



  return { rooms, isLoading, isError, refetch };
}

// ----- Read My Rooms -----
export function useReadMyRooms() {
  const { address } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_NOVANA_M_CONTRACT_ADDRESS as `0x${string}`;



  const {
    data: roomsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: novanaABI,
    functionName: "getMyRooms",
    account: address,
  });



  // Check if roomsData is undefined, object, or array
  // if (!roomsData) {
  //   console.warn(" [useReadMyRooms] roomsData is undefined or empty.");
  // } else {
  //   console.log(" [useReadMyRooms] roomsData type:", typeof roomsData);
  // }

  const roomsArray: RawRoom[] = Array.isArray(roomsData)
    ? roomsData
    : roomsData
    ? Object.values(roomsData)
    : [];



  const rooms: Room[] = roomsArray.map((r: RawRoom, i: number) => {

    return {
      id: Number(r.id),
      topic: r.topic,
      creator: r.creator,
      isPrivate: r.isPrivate,
      memberCount: Number(r.memberCount),
      farcasterChannelId: r.farcasterChannelId,
    };
  });

 

  return { rooms, isLoading, isError, refetch };
}

// ----- Join Room -----
export function useJoinRoom() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_NOVANA_M_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: hash,
    writeContractAsync,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const joinRoom = async (roomId: number) => {
    console.log("🟢 [JoinRoom] Hook initialized with:", {
      address,
      isConnected,
      contractAddress,
      roomId,
    });

    if (!isConnected) {
      toast.error("Please connect your wallet first!");
      throw new Error("Wallet not connected");
    }

    if (!contractAddress) {
      toast.error("Contract address missing");
      throw new Error("Contract address missing");
    }

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: novanaABI,
        functionName: "joinRoom",
        args: [roomId],
        account: address,
      });

      toast.info("⏳ Transaction sent... waiting for confirmation");
      console.log("📦 [JoinRoom Tx Sent] Hash:", tx);

      return tx;
    } catch (error) {
      console.error("🔴 [JoinRoom] Failed:", error);

      // Default message
      let message = "Transaction failed. Please try again.";

      // Catch revert reasons
      if (error instanceof BaseError) {
        const reason = error.shortMessage || error.message;

        if (reason.includes("OnlyRegisteredUser")) {
          message = "You must be a registered user to join this room.";
        } else if (reason.includes("RoomIsPrivate")) {
          message = "This room is private — ask the host for an invite.";
        } else if (reason.includes("RoomNotFound")) {
          message = "Room not found or has been deleted.";
        } else {
          message = reason;
        }
      }

      toast.error(message);
      throw error;
    }
  };

  return {
    joinRoom,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  };
}
