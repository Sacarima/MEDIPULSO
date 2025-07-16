import { useSelector } from 'react-redux'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user)
    const { currentDoctor } = useSelector((state) => state.doctor)
    const { currentClinic } = useSelector((state) => state.clinic)
    const { currentAdmin } = useSelector((state) => state.admin)
    const location = useLocation()


    const getActiveRole = () => {
        if (currentUser) return 'user'
        if (currentDoctor) return 'doctor'
        if (currentClinic) return 'clinic'
        if (currentAdmin) return 'admin'
        return null
    }

    const userRole = getActiveRole()

      if (!userRole) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Role exists, allow access
  return <Outlet />
  
}



export default PrivateRoute


