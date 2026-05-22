export const getUser = () => {
    return JSON.parse(localStorage.getItem("userData"));
};

export const setUser = (user) => {
    localStorage.setItem("userData", JSON.stringify(user));
};

export const logoutUser = () => {
    localStorage.removeItem("userData");
};
    