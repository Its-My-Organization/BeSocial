import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: {
    _id: "610a9da3d1bce85f2425c73a",
    profilePicture: "",
    coverPicture: "",
    followers: ["610a42787f107f36c4d9bb0f", "6194edef1388ad5b3caddeea"],
    followings: [
      "6194e1f71388ad5b3cadde80",
      "6194edef1388ad5b3caddeea",
      "6195ea93a159d62750812c95",
      "6195ef17a159d62750812cf0",
      "61a5d9315dadb51e18536da6",
    ],
    isAdmin: false,
    username: "Harry",
    email: "josh@gmail.com",
    password: "$2b$10$dVxsLiMsVj6Yu4HRcc5ZTOS00LKwPgUsD3U.ZPiwo32NtiNfZ75yq",
    createdAt: { $date: "2021-08-04T14:01:07.247Z" },
    updatedAt: { $date: "2021-11-26T16:44:28.723Z" },
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
