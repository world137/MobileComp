import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

function SignOut() {

    let [cookies, removeCookie] = useCookies(['token'])
    let navigate = useNavigate()

 useEffect(() => {
        removeCookie('token',{path: '/'})
        navigate('/signin')
 }, [])

    return (
        <div>
            <center>
                <h1>กำลังออกจากระบบ</h1>
            </center>
        </div>
    )
  }
  
  export default SignOut