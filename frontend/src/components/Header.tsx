import {Link, useNavigate} from "react-router-dom"

const Header = () => {

    const navigate = useNavigate()

    const handleLogout = () => {
        console.log("Logout clicked")

        localStorage.removeItem("token")
        localStorage.removeItem("logged_in")
        
        console.log("User successfully logged out.")

        navigate("/login")
    }

    return (
        <>
            <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-md z-50">
                Header
                {!localStorage.getItem("token") &&
                    <button><Link to="/login">Login</Link></button>
                }
                {localStorage.getItem("token") &&
                    <button onClick={() => handleLogout()}>Logout</button>
                }
            </div>
        </>
    )
}

export default Header
