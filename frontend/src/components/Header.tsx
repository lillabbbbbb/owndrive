import {Link, useNavigate} from "react-router-dom"

type HeaderProps = {
    jwt: string | null,
     onChangeToken: (c: string | null) => void;
}

const Header = ({jwt, onChangeToken}: HeaderProps) => {

    const navigate = useNavigate()

    const handleLogout = () => {
        console.log("Logout clicked")

        localStorage.removeItem("token")
        localStorage.removeItem("logged_in")
        onChangeToken(null)
        
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
                Header
                <button onClick={() => handleHomeClick()}>Home</button>
                {!jwt &&
                    <button><Link to="/login">Login</Link></button>
                }
                {jwt &&
                    <button onClick={() => handleLogout()}>Logout</button>
                }
            </div>
        </>
    )
}

export default Header
