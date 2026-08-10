import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation("app", { keyPrefix: "stubs" });
  return <div>{t("notFound")}</div>
}

export default NotFound
