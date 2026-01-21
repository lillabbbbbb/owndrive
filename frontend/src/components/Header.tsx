import {Link, useNavigate} from "react-router-dom"

type HeaderProps = {
    jwt: string | null,
    setJwt: (c: string | null) => void;
}

const Header = ({jwt, setJwt}: HeaderProps) => {

    const navigate = useNavigate()

    const handleLogout = () => {
        console.log("Logout clicked")

        localStorage.removeItem("token")
        localStorage.removeItem("logged_in")
        setJwt(null)
        
        console.log("User successfully logged out.")

        navigate("/login")
    }

    const handleHomeClick = () => {
        console.log("Home button clicked")
        navigate("/home")
    }

    return (
        <>
            <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-md z-50">
                {!jwt &&
                    <button><Link to="/login">Login</Link></button>
                }
                {jwt &&
                    <><button onClick={() => handleHomeClick()}>Home</button>
                    <button onClick={() => handleLogout()}>Logout</button></>
                }
            </div>
        </>
    )
}

export default Header
