import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { app } from "/firebase"
import {  useDispatch } from "react-redux"
import { signInSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"



//  OAuth component
export default function OAuth() {
        //  get the auth object from the app
        const auth = getAuth(app)
        //  get the dispatch function
        const dispatch = useDispatch()
        //  get the navigate function
        const navigate = useNavigate()
        //  handle the click event
        const handleGoogleClick = async () =>{
            //  create a new GoogleAuthProvider object
            const provider = new GoogleAuthProvider()
            //  set the custom parameters
            provider.setCustomParameters({ prompt: 'select_account' })
            //  sign in with the popup
            try {
                const resultsFromGoogle = await signInWithPopup(auth, provider)
                //  send the results to the server
                const res = await fetch('http://localhost:7500/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: resultsFromGoogle.user.displayName,
                        email: resultsFromGoogle.user.email,
                        googlePhotoUrl: resultsFromGoogle.user.photoURL,
                    }),
                    })

            
            //get the data from the response
            const data = await res.json()
            //  if the response is ok, dispatch the action
            if (res.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    } 
    return (
        <button 
            type='button' 
            className="w-full flex justify-center items-center py-2 px-4 rounded-sm bg-[#4285F4] text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#4285F4] focus:ring-[#4285F4] hover:bg-[#4285F4] hover:text-white hover:shadow-lg transition duration-300 ease-in-out"
            onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
            <span className="text-center">Continue with Google</span>
        </button>
  )
}