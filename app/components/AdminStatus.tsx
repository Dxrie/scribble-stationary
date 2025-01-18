'use client';
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next/client';
import { decrypt } from '../lib/libs';

interface JWTPayload {
  data: {
    isAdmin: boolean;
  };
}

const AdminStatus = () => {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const decryptFunc = async () => {
      const cookie = getCookie("session");

      if (cookie) {
        try {
          const payload = (await decrypt(cookie)) as unknown as JWTPayload;

          if (payload && payload.data.isAdmin !== undefined) {
            setAdmin(payload.data.isAdmin);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.log(err.message);
            setCookie("session", "", { expires: new Date(0) });
          } else {
            console.log("An error occurred.");
          }
        }
      }
    };

    decryptFunc();
  }, []);

  return <div>AdminStatus: {admin ? 'colinCTF{jwt_successfully_hacked}' : 'Not Admin'}</div>;
};

export default AdminStatus;
