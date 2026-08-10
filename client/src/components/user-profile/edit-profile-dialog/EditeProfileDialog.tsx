import { useTranslation } from "react-i18next";

const EditeProfileDialog = () => {
  const { t } = useTranslation("app", { keyPrefix: "stubs" });
  return <div>{t("editProfile")}</div>
}

export default EditeProfileDialog
