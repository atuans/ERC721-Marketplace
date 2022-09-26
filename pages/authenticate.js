import React, { useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { useRouter } from 'next/router'


const authenticate = () => {
    const {authenticate, isAuthenticated} = useMoralis()
    const router = useRouter();
    useEffect(() =>{
        if(isAuthenticated){
            router.push('/Mint')
        }
    },[isAuthenticated]);


  return (
    <div className="flew w-screen h-screen items-center justify-center">
        <button onClick={authenticate} className='bg-yellow-300 px-8 py-5 rounded-xl test-lg animate-pulse'>Login Metamask</button>
    </div>
  )
}

export default authenticate