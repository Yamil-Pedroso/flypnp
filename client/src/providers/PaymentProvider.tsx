import { PaymentsContext, usePaymentsController } from '../lib/hooks'

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const value = usePaymentsController()
  return <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>
}
