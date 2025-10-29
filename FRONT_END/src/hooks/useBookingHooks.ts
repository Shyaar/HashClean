import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";

import bookingABI from "../abi/booking.json"; // Correct ABI import

export function useReadBooking(bookingId?: number) {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_BOOKING_CONTRACT_ADDRESS as `0x${string}`;

  const { data: bookingDetails, isLoading: loadingBooking, refetch: refetchBooking, isError: errorBooking } = useReadContract({
    address: contractAddress,
    abi: bookingABI,
    functionName: "getBookingDetails", // Assuming a function to get booking details
    args: bookingId !== undefined ? [bookingId] : undefined,
    query: { enabled: !!bookingId && isConnected },
  });

  const { data: userBookings, isLoading: loadingUserBookings, refetch: refetchUserBookings, isError: errorUserBookings } = useReadContract({
    address: contractAddress,
    abi: bookingABI,
    functionName: "getUserBookings", // Assuming a function to get user's bookings
    args: address ? [address] : undefined,
    query: { enabled: !!address && isConnected },
  });

  return {
    bookingDetails,
    loadingBooking,
    refetchBooking,
    errorBooking,
    userBookings,
    loadingUserBookings,
    refetchUserBookings,
    errorUserBookings,
    address,
    isConnected,
  };
}

export function useBookingActions(contractAddress?: `0x${string}`) {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const createBooking = (counselorAddress: `0x${string}`, startTime: bigint, endTime: bigint, price: bigint) => {
    if (!counselorAddress || !startTime || !endTime || !price) {
      console.error("Missing arguments for booking creation");
      return;
    }

    try {
      writeContract({
        address:
          contractAddress ??
          (process.env.NEXT_PUBLIC_BOOKING_CONTRACT_ADDRESS as `0x${string}`),
        abi: bookingABI,
        functionName: "createBooking",
        args: [counselorAddress, startTime, endTime, price],
        value: price, // Assuming price is sent as value
      });
    } catch (err) {
      console.error("Error calling createBooking:", err);
    }
  };

  const cancelBooking = (bookingId: number) => {
    if (!bookingId) {
      console.error("Missing bookingId for cancellation");
      return;
    }

    try {
      writeContract({
        address:
          contractAddress ??
          (process.env.NEXT_PUBLIC_BOOKING_CONTRACT_ADDRESS as `0x${string}`),
        abi: bookingABI,
        functionName: "cancelBooking",
        args: [bookingId],
      });
    } catch (err) {
      console.error("Error calling cancelBooking:", err);
    }
  };

  const confirmBooking = (bookingId: number) => {
    if (!bookingId) {
      console.error("Missing bookingId for confirmation");
      return;
    }

    try {
      writeContract({
        address:
          contractAddress ??
          (process.env.NEXT_PUBLIC_BOOKING_CONTRACT_ADDRESS as `0x${string}`),
        abi: bookingABI,
        functionName: "confirmBooking",
        args: [bookingId],
      });
    } catch (err) {
      console.error("Error calling confirmBooking:", err);
    }
  };

  return {
    createBooking,
    cancelBooking,
    confirmBooking,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
