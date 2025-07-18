
import { AiFillApple } from "react-icons/ai"
import { useDispatch, useSelector } from 'react-redux'
import { appleSignIn } from '../redux/user/userSlice'

const AppleOAuth = () => {
        const dispatch = useDispatch()
        const { loading, error } = useSelector((state) => state.user)

        const handleAppleSignIn = async () => {
            const IdToken = 'appleIdToken'
            dispatch(appleSignIn(IdToken))
    }
    return (
       
            
            <div>
                <button
                    className='w-full flex justify-center items-center py-2 px-4 rounded-sm bg-[#000] text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#000] focus:ring-[#000] hover:bg-[#000] hover:text-white hover:shadow-lg transition duration-300 ease-in-out'
                    type='button'
                >
                    <AiFillApple className='w- h-6 mr-2'/>
                    <span className="text-center">{loading ? 'Continue...' : 'Continue with Apple'}</span>
                </button>
                {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
            </div>
        
        
    )
    }

    export default AppleOAuth