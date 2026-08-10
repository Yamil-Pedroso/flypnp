import { useTranslation } from "react-i18next";

const RoomsPage = () => {
  const { t } = useTranslation("app", { keyPrefix: "stubs" });
  return <div>{t("rooms")}</div>
}

export default RoomsPage
