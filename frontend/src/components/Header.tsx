import {Link} from "react-router-dom"

const Header = () => {


    return (
        <>
            <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-md z-50">
                Header
                <button><Link to="/login">Login</Link></button>
            </div>
        </>
    )
}

export default Header
