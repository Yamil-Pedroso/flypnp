import images from "../../assets/images";
import type { TravelServiceType } from "../../services";

const iconByService: Record<TravelServiceType, string> = {
  "airport-transfer": images.car,
  "pet-care": images.petFoot,
  "local-guide": images.local,
};

const ServiceIcon = ({
  serviceType,
  className = "",
}: {
  serviceType: TravelServiceType;
  className?: string;
}) => {
  const icon = iconByService[serviceType];

  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        WebkitMaskImage: `url("${icon}")`,
        maskImage: `url("${icon}")`,
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
};

export default ServiceIcon;
