import { CiUser } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";

export default function Login() {
    return (
        <div>
            <div className="text-center py-4">
                <h1 className="text-6xl font-bold">Login</h1>
            </div>
            <form>
                <div className="my-2 flex bg-gray-300 rounded-lg">
                    <CiUser className="text-2xl" />
                    <input type="text" placeholder="example@email.com" className="mx-2 bg-transparent w-full" />
                </div>
                <div className="my-2 flex bg-gray-300 rounded-lg">
                    <RiLockPasswordFill className="text-2xl" />
                    <input type="password" placeholder="*****" className="mx-2 bg-transparent w-full" />
                </div>

                <div>
                    <button className="w-full bg-black text-white p-2 rounded-lg">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
        
    )
}