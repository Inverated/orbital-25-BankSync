'use client'
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
  
    const redirectToLogin = () => {
        router.push('/registration')
    }

    return(
        <nav>
            <button onClick={ redirectToLogin }> Sign in</button>  
        </nav> 
    )
}