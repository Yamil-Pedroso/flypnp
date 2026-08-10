import { useTranslation } from "react-i18next";

const SingleBookedPage = () => {
  const { t } = useTranslation("app", { keyPrefix: "stubs" });
  return <div>{t("booking")}</div>
}

export default SingleBookedPage
