import { DEMO_ACCOUNT } from "../config/demoAccount";
import { User } from "../models/User";

export const getOrRestoreDemoAccount = async () => {
  let user = await User.findOne({ email: DEMO_ACCOUNT.email });

  if (!user) {
    user = await User.create({ ...DEMO_ACCOUNT, isAdmin: false });
    return user;
  }

  const passwordIsCurrent = await user.isValidatedPassword(DEMO_ACCOUNT.password);
  user.name = DEMO_ACCOUNT.name;
  user.avatar = DEMO_ACCOUNT.avatar;
  user.isAdmin = false;
  if (!passwordIsCurrent) user.password = DEMO_ACCOUNT.password;
  await user.save();

  return user;
};
