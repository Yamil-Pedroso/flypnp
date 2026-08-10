import { useTranslation } from "react-i18next";

const Places = () => {
  const { t } = useTranslation("app", { keyPrefix: "stubs" });
  return <div>{t("places")}</div>
}

export default Places
