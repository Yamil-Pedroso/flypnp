const cookieToken = (user: any, res: any) => {
  const token = user.getSignedJwtToken();

  const cookiesExpireDays = Number(process.env.JWT_COOKIE_EXPIRE) || 7; // fallback de 7 días

  const options = {
    expires: new Date(Date.now() + cookiesExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  user.password = undefined;

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

export default cookieToken;
