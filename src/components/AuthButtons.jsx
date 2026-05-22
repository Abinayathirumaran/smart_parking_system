import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../services/auth";

function AuthButtons() {

    const user = getUser();

    const location = useLocation();

    const navigate = useNavigate();

    // identify landing page
    const isLanding = location.pathname === "/";

    // logout
    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };


    // Landing page 
    if (isLanding) {
        return (
            <>
                <Link to="/login">
                    <button type="button" className="cursor-pointer px-5 py-2 rounded-xl font-semibold text-black bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] hover:scale-105 transition-all duration-300">
                        Login
                    </button>
                </Link>

                <Link to="/signup">
                    <button type="button" className="cursor-pointer px-5 py-2 rounded-xl font-semibold text-white border border-white/40  bg-white/5 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10 hover:scale-105 transition-all duration-300">
                        Signup
                    </button>
                </Link>
            </>
        );
    }

    // Logged in user
    if (user) {
        return (
            <button type="button"
                onClick={handleLogout}
                className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
                Logout
            </button>
        );
    }


    // Other pages + not logged in
    return (
        <>
            <Link to="/login">
                <button type="button" className="border border-cyan-400 text-cyan-400 px-4 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition duration-300">
                    Login
                </button>
            </Link>

            <Link to="/signup">
                <button type="button" className="bg-cyan-400 text-black px-4 py-2 rounded-lg font-semibold hover:scale-105 transition duration-300">
                    Signup
                </button>
            </Link>
        </>
    );
}

export default AuthButtons;