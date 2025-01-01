import { signIn, signOut, auth } from "@/auth"
 
export default async function SignInG() {
    const session = await auth();
    const user = session?.user;
    console.log("user:", user);

    // if (user) {
    //     return (
    //         <form
    //         action={async () => {
    //             "use server"
    //             await signOut();
    //         }}
    //         >
    //             <h1>{user?.email}</h1>

    //             <button>Sign out</button>
    //         </form>            
    //     )
        
    // }

  return (
    <form
      action={async () => {
        // "use server"
        await signIn("google")
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  ) 
}