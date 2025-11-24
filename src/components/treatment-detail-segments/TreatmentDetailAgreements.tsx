import { format } from "@formkit/tempo";
import { IonButton } from "@ionic/react";
import type { TreatmentDetail } from "@src/schemas/treatment";
import type {
  AgreementResponse,
  AgreementStatusType,
} from "@src/schemas/agreement";
import { useState } from "react";
import AgreementDialog from "@src/components/dialogs/AgreementDialog";

interface TreatmentDetailAgreementsProps {
  treatment: TreatmentDetail;
}

function getStatusColor(status: AgreementStatusType) {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Active":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Canceled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function formatDate(date: string | null | undefined) {
  if (!date) return "N/A";
  return format(date, "MMM DD, YYYY");
}

export default function TreatmentDetailAgreements({
  treatment,
}: TreatmentDetailAgreementsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAgreement, setSelectAgreement] =
    useState<AgreementResponse | null>(null);

  function handleButtonClick(agreement: AgreementResponse) {
    setSelectAgreement(agreement);
    setIsModalOpen(true);
  }

  if (!treatment.agreements || treatment.agreements.length === 0) {
    return (
      <div className="px-4">
        <div className="flex justify-center items-center py-8 italic text-gray-500">
          No agreements found for this treatment.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 flex flex-col justify-center items-center gap-4">
        {treatment.agreements.map((agreement) => {
          const isViewable =
            agreement.status === "Canceled" || agreement.status === "Completed";

          return (
            <div
              key={agreement.id}
              className="bg-gray-50 w-full p-4 rounded-xl border border-blue-200 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-blue-500">
                    {agreement.agreementCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {agreement.treatmentName}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    agreement.status
                  )}`}
                >
                  {agreement.status}
                </span>
              </div>

              <div className="bg-gray-200 w-full h-0.5" />

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Patient:</span>
                  <span className="font-normal text-xs text-black">
                    {agreement.patientName}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Start Date:</span>
                  <span className="font-normal text-xs text-black">
                    {formatDate(agreement.startDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">End Date:</span>
                  <span className="font-normal text-xs text-black">
                    {formatDate(agreement.endDate)}
                  </span>
                </div>

                <div className="bg-gray-200 w-full h-0.5 my-1" />

                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Signed by Patient:</span>
                  <span className="font-normal text-xs text-black">
                    {agreement.signedByPatient ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Signed by Doctor:</span>
                  <span className="font-normal text-xs text-black">
                    {agreement.signedByDoctor ? "Yes" : "No"}
                  </span>
                </div>

                {agreement.signedDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Signed Date:</span>
                    <span className="font-normal text-xs text-black">
                      {formatDate(agreement.signedDate)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2">
                <IonButton
                  size="small"
                  color="primary"
                  onClick={() => handleButtonClick(agreement)}
                  className="w-full"
                >
                  {isViewable ? "View Detail" : "Sign Agreement"}
                </IonButton>
              </div>
            </div>
          );
        })}
      </div>

      <AgreementDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        agreement={selectAgreement}
      />
    </>
  );
}
