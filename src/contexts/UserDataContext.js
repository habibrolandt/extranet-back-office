import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserData } from "../api/User";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (currentUser) {
            const newUser = fetchUserData(currentUser.LG_UTIID);
            newUser.then((data) => {
                if (data) {
                    setUser(data);
                }
            });
        }
    }, []);

    const handleSetUserData = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    return (
        <UserDataContext.Provider value={{ user, handleSetUserData }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = () => useContext(UserDataContext);
