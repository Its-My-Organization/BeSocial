import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });

  try {
    const res = await axios.post("/auth/login", userCredentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

export const signupCall = async (userInfo, dispatch) => {
  dispatch({ type: "SIGNUP_START" });

  try {
    const res = await axios.post("/auth/register", userInfo);
    dispatch({ type: "SIGNUP_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "SIGNUP_FAILURE", payload: err });
  }
};

export const followCall = async (userIds, dispatch) => {
  try {
    await axios.put("/users/" + userIds.followId + "follow", {
      userId: userIds.userId,
    });
    dispatch({ type: "FOLLOW", payload: userIds.followId });
  } catch (error) {
    console.log("Error occurred while following", error);
  }
};

export const unfollowCall = async (userIds, dispatch) => {
  try {
    await axios.put("/users/" + userIds.followId + "unfollow", {
      userId: userIds.userId,
    });
    dispatch({ type: "UNFOLLOW", payload: userIds.followId });
  } catch (error) {
    console.log("Error occurred while unfollowing", error);
  }
};
