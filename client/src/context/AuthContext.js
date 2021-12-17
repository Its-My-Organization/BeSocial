import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: {
    _id: "6194edef1388ad5b3caddeea",
    profilePicture: "",
    coverPicture: "",
    followers: ["610a9da3d1bce85f2425c73a"],
    followings: ["610a9da3d1bce85f2425c73a"],
    isAdmin: false,
    username: "bijaya",
    email: "bijaya@gmail.com",
    password: "$2b$10$lcSRF0N7Twma33IJbrIUIuQXcog6tdzlnz0xo7KZ4wPb3TElRtM06",
    createdAt: { $date: "2021-11-17T11:56:31.884Z" },
    updatedAt: { $date: "2021-12-02T03:14:45.578Z" },
    __v: 0,
  },
  isFetching: false,
  error: false,
};

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
