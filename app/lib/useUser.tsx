// "use client";
//
// import {useEffect, useState} from "react";
// import {getCookie, setCookie} from "cookies-next/client";
// import {decrypt} from "@/app/lib/libs";
//
// const useUserId = () => {
//     const [userId, setUserId] = useState<string | null>(null);
//
//     useEffect(() => {
//         const decryptFunc = async () => {
//             const cookie = getCookie("session");
//             if (!cookie) return;
//
//             try {
//                 const payload = (await decrypt(cookie)) as { data: { _id: string } };
//                 if (payload?.data?._id) setUserId(payload.data._id);
//             } catch (error) {
//                 console.error("Failed to decrypt session:", error);
//                 setCookie("session", "", { expires: new Date(0) });
//             }
//         };
//
//         decryptFunc();
//     }, []);
//
//     return userId;
// };
//
// export default useUserId;