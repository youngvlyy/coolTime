import axios from "axios";

export const getCooltime = async (uid: string) => {
  const res = await axios.get(`/api/cooltime/${uid}`);
  return res.data.seconds;
};

export const setCooltime = async (uid: string, seconds: number) => {
  const res = await axios.post(`/api/cooltime`, { uid, seconds });
  return res.data;
};
