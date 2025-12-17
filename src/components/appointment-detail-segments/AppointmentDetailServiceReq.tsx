import { format } from "@formkit/tempo";
import { formatCurrency } from "@src/utils/currency";
import {
  IonList,
  IonItem,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
} from "@ionic/react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import type { ServiceRequestApiResponse } from "@src/schemas/service-request";

interface AppointmentDetailServiceReqProps {
  serviceRequestQuery: UseQueryResult<ServiceRequestApiResponse, HTTPError>;
}

export default function AppointmentDetailServiceReq({
  serviceRequestQuery,
}: AppointmentDetailServiceReqProps) {
  const { data, isError } = serviceRequestQuery;
  const serviceRequests = data?.data ?? [];

  if (isError || !data) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-red-500">
          Error loading service requests.
        </div>
      </div>
    );
  }

  if (serviceRequests.length === 0) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-gray-500">
          No service requests found for this appointment.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 flex flex-col gap-4">
      <IonList className="bg-transparent!">
        {serviceRequests.map((serviceRequest, i) => (
          <IonItem
            key={serviceRequest.id}
            lines="full"
            className="bg-gray-50 rounded-xl border border-blue-200 shadow-lg mb-4"
          >
            <div className="w-full flex flex-col gap-3 py-2">
              <div className="flex justify-between items-center">
                <IonLabel className="text-base font-semibold text-blue-500!">
                  Service Request {i + 1}
                </IonLabel>
                <span className="text-xs text-black px-2 py-1 rounded bg-gray-100">
                  {serviceRequest.statusName}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Request Date:</span>
                  <span className="font-normal text-xs text-black">
                    {serviceRequest.requestDate
                      ? format(serviceRequest.requestDate, "MMM DD, YYYY")
                      : "N/A"}
                  </span>
                </div>

                {serviceRequest.approvedDate && (
                  <div className="flex justify-between items-center">
                    <span>Approved Date:</span>
                    <span className="font-normal text-xs text-black">
                      {format(serviceRequest.approvedDate, "MMM DD, YYYY")}
                    </span>
                  </div>
                )}

                {serviceRequest.totalAmount !== null && (
                  <div className="flex justify-between items-center">
                    <span>Total Amount:</span>
                    <span className="font-normal text-xs text-black">
                      {formatCurrency(serviceRequest.totalAmount, {
                        currency: "VND",
                        locale: "vi-VN",
                      })}
                    </span>
                  </div>
                )}

                {serviceRequest.notes && (
                  <div className="flex flex-col gap-1">
                    <span>Notes:</span>
                    <span className="font-normal text-xs text-black">
                      {serviceRequest.notes}
                    </span>
                  </div>
                )}
              </div>

              {serviceRequest.serviceDetails.length > 0 && (
                <IonAccordionGroup>
                  <IonAccordion value={`details-${serviceRequest.id}`}>
                    <IonItem
                      slot="header"
                      lines="none"
                      className="w-full py-2 ion-min-h-[0rem]! ion-p-[0rem]! ion-ps-[0.5rem]! ion-b-r-[6px]"
                    >
                      <IonLabel className="text-sm text-sky-700!">
                        Service Details ({serviceRequest.serviceDetails.length})
                      </IonLabel>
                    </IonItem>

                    <div slot="content" className="px-0 py-2">
                      <IonList className="bg-transparent">
                        {serviceRequest.serviceDetails.map((detail, index) => (
                          <IonItem
                            key={detail.id}
                            lines={
                              index < serviceRequest.serviceDetails.length - 1
                                ? "full"
                                : "none"
                            }
                            className="bg-gray-100 rounded-lg mb-2"
                          >
                            <div className="w-full flex flex-col gap-2 py-2">
                              <div className="flex justify-between items-center">
                                <IonLabel className="text-sm font-medium!">
                                  {detail.serviceName}
                                </IonLabel>
                                {detail.serviceCode && (
                                  <span className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-200">
                                    {detail.serviceCode}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Quantity:</span>
                                  <span className="text-black">
                                    {detail.quantity}
                                    {detail.serviceUnit
                                      ? ` ${detail.serviceUnit}`
                                      : ""}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Unit Price:</span>
                                  <span className="text-black">
                                    {formatCurrency(detail.unitPrice, {
                                      currency: "VND",
                                      locale: "vi-VN",
                                    })}
                                  </span>
                                </div>
                                {detail.discount !== null &&
                                  detail.discount > 0 && (
                                    <div className="flex justify-between">
                                      <span className="font-semibold">
                                        Discount:
                                      </span>
                                      <span className="text-black">
                                        {formatCurrency(detail.discount, {
                                          currency: "VND",
                                          locale: "vi-VN",
                                        })}
                                      </span>
                                    </div>
                                  )}
                                <div className="flex justify-between">
                                  <span className="font-semibold">
                                    Total Price:
                                  </span>
                                  <span className="text-black font-semibold">
                                    {formatCurrency(detail.totalPrice, {
                                      currency: "VND",
                                      locale: "vi-VN",
                                    })}
                                  </span>
                                </div>
                                {detail.notes && (
                                  <div className="flex flex-col gap-1 mt-1">
                                    <span className="font-semibold">
                                      Notes:
                                    </span>
                                    <span className="text-black">
                                      {detail.notes}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </IonItem>
                        ))}
                      </IonList>
                    </div>
                  </IonAccordion>
                </IonAccordionGroup>
              )}
            </div>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
}
