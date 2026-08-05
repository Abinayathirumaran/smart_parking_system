import { jwtDecode } from "jwt-decode";
//decode the token whenever the components ask for user's data
export const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token)
        return null;
    try {
        const decoded = jwtDecode(token);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return null;
        }
        return {
            id: decoded.userId || decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
        };
    } catch (err) {
        console.error("Failed to decode token", err);
        return null;
    }
};
// sets the user token
export const setUser = (token) => {
    localStorage.setItem("token", token)
};
//Remove token from ls(log out concept)
export const logoutUser = () => {
    localStorage.removeItem("token");
};