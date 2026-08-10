import { useTranslation } from "react-i18next";

const SingleBookingPlace = () => {
  const { t } = useTranslation("app", { keyPrefix: "stubs" });
  return <div>{t("booking")}</div>
}

export default SingleBookingPlace
