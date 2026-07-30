import { http } from './http'
import type { ApiResponse, ServiceRequest, ServiceRequestInput } from './types'

export const travelServicesService = {
  async listRequests() {
    return (await http.get<ApiResponse<ServiceRequest[]> & { count: number }>(
      '/service-requests',
    )).data.data
  },
  async createRequest(input: ServiceRequestInput) {
    return (await http.post<ApiResponse<ServiceRequest>>(
      '/service-requests',
      input,
    )).data.data
  },
  async cancelRequest(id: string) {
    await http.delete(`/service-requests/${id}`)
  },
  async listAllRequests() {
    return (await http.get<ApiResponse<ServiceRequest[]> & { count: number }>(
      '/admin/service-requests',
    )).data.data
  },
  async quoteRequest(id: string, input: {
    quotePrice: number
    provider: { name: string; email?: string; phone?: string }
    adminMessage?: string
  }) {
    return (await http.patch<ApiResponse<ServiceRequest>>(
      `/admin/service-requests/${id}/quote`,
      input,
    )).data.data
  },
}
