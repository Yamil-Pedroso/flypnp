import { useTranslation } from "react-i18next";

const AccountNav = () => {
  const { t } = useTranslation("app", { keyPrefix: "stubs" });
  return <div>{t("accountNav")}</div>
}

export default AccountNav
