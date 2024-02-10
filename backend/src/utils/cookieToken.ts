const cookieToken = (user: any, res: any) => {
    const token = user.getSignedJwtToken();
    const cookiesExpire = process.env.JWT_COOKIE_EXPIRE as any;
    const options = {
        expires: new Date(Date.now() + cookiesExpire * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    user.password = undefined;
    res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user,
    });
}

export default cookieToken;
