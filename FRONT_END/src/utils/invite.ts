// import { signTypedData } from 'wagmi/actions'

// // domain + types as before
// const domain = {
//   name: "HavenPrivateRooms",
//   version: "1",
//   chainId: 11155111,
//   verifyingContract: "0xYourContractAddress"
// };

// const types = {
//   Invite: [
//     { name: "inviter", type: "address" },
//     { name: "invitee", type: "address" },
//     { name: "roomId", type: "uint256" },
//     { name: "expiry", type: "uint256" },
//   ],
// };

// async function createInvite(invitee, roomId, signer) {
//   const invite = {
//     inviter: await signer.getAddress(),
//     invitee,
//     roomId,
//     expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour validity
//   };

//   const signature = await signer.signTypedData(domain, types, invite);
//   return { invite, signature };
// }
