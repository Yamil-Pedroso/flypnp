interface ServiceProviderView {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ServiceRequestView {
  status?: string;
  provider?: ServiceProviderView;
  toObject?: () => ServiceRequestView;
  [key: string]: unknown;
}

export const serviceRequestView = (
  request: unknown,
  revealProviderContacts = false,
) => {
  const source = request as ServiceRequestView;
  const value = typeof source.toObject === "function" ? source.toObject() : { ...source };

  if (
    value.provider &&
    !revealProviderContacts &&
    value.status !== "confirmed"
  ) {
    value.provider = value.provider.name ? { name: value.provider.name } : undefined;
  }

  return value;
};
