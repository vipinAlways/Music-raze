"use client";

import { signIn, useSession ,signOut} from "next-auth/react";

function Appbar() {

    const session = useSession()

    
  return (
    <div className="flex justify-between">
      <div>
        Muzi
      </div>
      <div>
       {
        session.data?.user ?  <button className="m-2 p-2 bg-blue-400" onClick={() => signOut()}>
        log out
      </button> : <button className="m-2 p-2 bg-blue-400" onClick={() => signIn()}>
          Sign In
        </button>
       }
      </div>
    </div>
  );
}

export default Appbar;
