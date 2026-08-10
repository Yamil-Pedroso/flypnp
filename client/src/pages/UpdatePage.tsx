import { useTranslation } from "react-i18next";

const UpdatePage = () => {
  const { t } = useTranslation("app", { keyPrefix: "stubs" });
  return <div>{t("update")}</div>
}

export default UpdatePage
