import { useState } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'

const DropdownMenu = ()  => {
    const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='relative flex flex-col items-center '>
        <Link to='/login'>
                    <Button outline gradientDuoTone="greenToBlue">
                        Login
                    </Button>
        </Link>
        <button className=' p-4 w-full flex items-center justify-center gap-4 font-bold text-lg 
            rounded-lg tracking-wider border-4 border-transparent'
            onClick={() => setIsOpen((prev) => !prev)}
        >
            Register for free
            {!isOpen ? (
                <AiOutlineCaretDown  className='h-8' />
            ) : (
                <AiOutlineCaretUp  className='h-8' />
            ) }
        </button>
                {isOpen && (
                    <div className='absolute top-20 flex flex-col items-center rounded-lg p-2 w-full'>
                        <div className='w-full p-4 flex flex-col  rounded-r-lg justify-center border-l-transparent hover:border-l-whote border-l-4'>
                            <Link to='/login'>
                                <p className=' text-center hover:font-semibold'>as a client</p>
                            </Link>
                            <Link to='/login'>
                                <p className='my-8 cursor-pointer text-center hover:font-semibold'>as a doctor</p>
                            </Link>
                            <Link to='/login'>
                                <p className='  text-center hover:font-semibold'>as a facility</p>
                            </Link>
                        </div>
                    </div>
                )}
                
                
            </div>
            
           )
        }

export default DropdownMenu;
