import { http } from "../../plugins/axios";
import { Router } from "../../plugins/i18n";
import { setAlert } from "./alert";
import {
  CREATE_MATCH_SUCCESS,
  CREATE_MATCH_FAIL,
  BEGIN_MATCH_SUCCESS,
  BEGIN_MATCH_FAIL,
  JOIN_MATCH_SUCCESS,
  JOIN_MATCH_FAIL,
} from "./types";

const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const createMatch = (user) => async (dispatch) => {
  try {
    const res = await http.post("/matches", {
      withCredentials: true,
      maxRounds: 5,
      headers: {
        "Content-Type": "application/json",
      },
    });
    await http.put(`/matches/join/${res.data.token}`, {
      user,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({
      type: CREATE_MATCH_SUCCESS,
      payload: res.data,
    });
    return Router.push("/waiting-room");
  } catch (error) {
    return dispatch({
      type: CREATE_MATCH_FAIL,
    });
  }
};

export const beginMatch = (matchId) => async (dispatch) => {
  try {
    const res = await http.put(`/matches/beginMatch/${matchId}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({
      type: BEGIN_MATCH_SUCCESS,
      payload: res.data,
    });
    return Router.push("/choose-place");
  } catch (error) {
    return dispatch({
      type: BEGIN_MATCH_FAIL,
    });
  }
};

export const joinMatch = (user, token) => async (dispatch) => {
  try {
    const res = await http.put(`/matches/join/${token}`, {
      withCredentials: true,
      user,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({
      type: JOIN_MATCH_SUCCESS,
      payload: res.data,
    });
    return Router.push("/waiting-room");
  } catch (error) {
    return dispatch({
      type: JOIN_MATCH_FAIL,
    });
  }
};
