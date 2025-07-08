const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "2592000000"),
  path: "/",
};

const setCookie = (res, token) => {
  res.cookie("token", token, cookieOptions);
};

const clearCookie = (res) => {
  res.clearCookie("token", {
    ...cookieOptions,
    maxAge: undefined,
  });
};

module.exports = {
  setCookie,
  clearCookie,
  cookieOptions,
};
