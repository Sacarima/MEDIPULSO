// import { AiFillGoogleCircle } from "react-icons/ai"
// import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
// import { app } from "/firebase"
// import {  useDispatch } from "react-redux"
// import { signInSuccess } from "../redux/user/userSlice"
// import { useNavigate } from "react-router-dom"



// //  OAuth component
// export default function OAuth() {
//         //  get the auth object from the app
//         const auth = getAuth(app)
//         //  get the dispatch function
//         const dispatch = useDispatch()
//         //  get the navigate function
//         const navigate = useNavigate()

//         const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
//         //  handle the click event
//         const handleGoogleClick = async () =>{
//             //  create a new GoogleAuthProvider object
//             const provider = new GoogleAuthProvider()
//             //  set the custom parameters
//             provider.setCustomParameters({ prompt: 'select_account' })
//             //  sign in with the popup
//             try {
//                 const resultsFromGoogle = await signInWithPopup(auth, provider)
//                 //  send the results to the server
//                 const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         name: resultsFromGoogle.user.displayName,
//                         email: resultsFromGoogle.user.email,
//                         googlePhotoUrl: resultsFromGoogle.user.photoURL,
//                     }),
//                     })

            
//             //get the data from the response
//             const data = await res.json()
//             //  if the response is ok, dispatch the action
//             if (res.ok){
//                 dispatch(signInSuccess(data))
//                 navigate('/')
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     } 
//     return (
//         <button 
//             type='button' 
//             className="w-full flex justify-center items-center py-2 px-4 rounded-sm bg-[#4285F4] text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#4285F4] focus:ring-[#4285F4] hover:bg-[#4285F4] hover:text-white hover:shadow-lg transition duration-300 ease-in-out"
//             onClick={handleGoogleClick}>
//             <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
//             <span className="text-center">Continue with Google</span>
//         </button>
//   )
// }

// OAuth.jsx
import { AiFillGoogleCircle } from "react-icons/ai"
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  getAdditionalUserInfo
} from "firebase/auth"
import { app } from "/firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"

// helper to normalize names
function normalizeNames({ displayName, given_name, family_name }) {
  const trimmed = (displayName || "").trim()
  if (given_name || family_name) {
    return {
      firstName: given_name || trimmed.split(" ")[0] || "",
      lastName: family_name || trimmed.split(" ").slice(1).join(" ") || "",
    }
  }
  // fallback: split displayName
  const parts = trimmed.split(" ").filter(Boolean)
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  }
}

export default function OAuth() {
  const auth = getAuth(app)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      // ensure we have the basic scopes (Firebase already adds email/profile by default)
      provider.addScope("email")
      provider.addScope("profile")
      provider.setCustomParameters({ prompt: "select_account" })

      const result = await signInWithPopup(auth, provider)
      const info = getAdditionalUserInfo(result)
      const profile = (info && info.profile) || {}
      const { firstName, lastName } = normalizeNames({
        displayName: result.user.displayName,
        given_name: profile.given_name,
        family_name: profile.family_name,
      })

      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: result.user.email,
          googlePhotoUrl: result.user.photoURL,
        }),
        credentials: "include",
      })

      const data = await res.json()
      if (res.ok) {
        // make sure `data` includes firstName/lastName from your backend
        dispatch(signInSuccess(data))
        navigate("/")
      } else {
        console.error("Google auth failed:", data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button
      type="button"
      className="w-full flex justify-center items-center py-2 px-4 rounded-sm bg-[#4285F4] text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#4285F4] focus:ring-[#4285F4] hover:bg-[#4285F4] hover:text-white hover:shadow-lg transition duration-300 ease-in-out"
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      <span className="text-center">Continue with Google</span>
    </button>
  )
}
