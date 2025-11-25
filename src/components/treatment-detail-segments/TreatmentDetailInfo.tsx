import { format } from "@formkit/tempo";
import type { TreatmentDetail } from "@src/schemas/treatment";

interface TreatmentDetailInfoProps {
  treatment: TreatmentDetail;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "N/A";
  return format(date, "MMM DD, YYYY");
}

export default function TreatmentDetailInfo({
  treatment,
}: TreatmentDetailInfoProps) {
  return (
    <div className="px-4 flex flex-col justify-center items-center gap-4">
      <div className="bg-gray-50 w-full p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-blue-500 mb-2">
          Basic Information
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Treatment Name:</span>
            <span className="font-normal text-xs text-black">
              {treatment.treatmentName}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Treatment Type:</span>
            <span className="font-normal text-xs text-black">
              {treatment.treatmentType}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Status:</span>
            <span className="font-normal text-xs text-black px-2 py-1 rounded bg-gray-100">
              {treatment.status}
            </span>
          </div>

          <div className="bg-gray-200 w-full h-0.5 my-1" />

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Start Date:</span>
            <span className="font-normal text-xs text-black">
              {formatDate(treatment.startDate)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">End Date:</span>
            <span className="font-normal text-xs text-black">
              {formatDate(treatment.endDate)}
            </span>
          </div>
        </div>
      </div>

      {(treatment.diagnosis || treatment.goals || treatment.notes) && (
        <div className="bg-gray-50 w-full p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-blue-500 mb-2">
            Medical Information
          </h2>

          <div className="flex flex-col gap-2">
            {treatment.diagnosis && (
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-semibold">Diagnosis:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.diagnosis}
                </span>
              </div>
            )}

            {treatment.goals && (
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-semibold">Goals:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.goals}
                </span>
              </div>
            )}

            {treatment.notes && (
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-semibold">Notes:</span>
                <span className="font-normal text-xs text-black whitespace-pre-wrap">
                  {treatment.notes}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {(treatment.estimatedCost !== null || treatment.actualCost !== null) && (
        <div className="bg-gray-50 w-full p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-blue-500 mb-2">
            Financial Information
          </h2>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Estimated Cost:</span>
              <span className="font-normal text-xs text-black">
                {treatment.estimatedCost}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Actual Cost:</span>
              <span className="font-normal text-xs text-black">
                {treatment.actualCost}
              </span>
            </div>
          </div>
        </div>
      )}

      {treatment.treatmentType === "IVF" && (
        <div className="bg-gray-50 w-full p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-blue-500 mb-2">
            IVF Details
          </h2>

          <div className="flex flex-col gap-2">
            {treatment.ivf.protocol && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Protocol:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.ivf.protocol}
                </span>
              </div>
            )}

            <div className="bg-gray-200 w-full h-0.5 my-1" />

            <div className="text-sm font-semibold mb-1">Important Dates:</div>
            {treatment.ivf.stimulationStartDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Stimulation Start:</span>
                <span className="font-normal text-xs text-black">
                  {formatDate(treatment.ivf.stimulationStartDate)}
                </span>
              </div>
            )}
            {treatment.ivf.oocyteRetrievalDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Oocyte Retrieval:</span>
                <span className="font-normal text-xs text-black">
                  {formatDate(treatment.ivf.oocyteRetrievalDate)}
                </span>
              </div>
            )}
            {treatment.ivf.fertilizationDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Fertilization:</span>
                <span className="font-normal text-xs text-black">
                  {formatDate(treatment.ivf.fertilizationDate)}
                </span>
              </div>
            )}
            {treatment.ivf.transferDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Transfer:</span>
                <span className="font-normal text-xs text-black">
                  {formatDate(treatment.ivf.transferDate)}
                </span>
              </div>
            )}

            <div className="bg-gray-200 w-full h-0.5 my-1" />

            <div className="text-sm font-semibold mb-1">
              Oocyte Information:
            </div>
            {treatment.ivf.oocytesRetrieved !== null && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Oocytes Retrieved:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.ivf.oocytesRetrieved}
                </span>
              </div>
            )}
            {treatment.ivf.oocytesMature !== null && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Oocytes Mature:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.ivf.oocytesMature}
                </span>
              </div>
            )}
            {treatment.ivf.oocytesFertilized !== null && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Oocytes Fertilized:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.ivf.oocytesFertilized}
                </span>
              </div>
            )}

            <div className="bg-gray-200 w-full h-0.5 my-1" />

            <div className="text-sm font-semibold mb-1">
              Embryo Information:
            </div>
            {treatment.ivf.embryosCultured !== null && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Embryos Cultured:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.ivf.embryosCultured}
                </span>
              </div>
            )}
            {treatment.ivf.embryosTransferred !== null && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Embryos Transferred:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.ivf.embryosTransferred}
                </span>
              </div>
            )}
            {treatment.ivf.embryosCryopreserved !== null && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Embryos Cryopreserved:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.ivf.embryosCryopreserved}
                </span>
              </div>
            )}
            {treatment.ivf.embryosFrozen !== null && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Embryos Frozen:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.ivf.embryosFrozen}
                </span>
              </div>
            )}

            {treatment.ivf.usedICSI !== null && (
              <>
                <div className="bg-gray-200 w-full h-0.5 my-1" />
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">ICSI Used:</span>
                  <span className="font-normal text-xs text-black">
                    {treatment.ivf.usedICSI ? "Yes" : "No"}
                  </span>
                </div>
              </>
            )}

            {treatment.ivf.outcome && (
              <>
                <div className="bg-gray-200 w-full h-0.5 my-1" />
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">Outcome:</span>
                  <span className="font-normal text-xs text-black">
                    {treatment.ivf.outcome}
                  </span>
                </div>
              </>
            )}

            {treatment.ivf.complications && (
              <>
                <div className="bg-gray-200 w-full h-0.5 my-1" />
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">Complications:</span>
                  <span className="font-normal text-xs text-black">
                    {treatment.ivf.complications}
                  </span>
                </div>
              </>
            )}

            {treatment.ivf.notes && (
              <>
                <div className="bg-gray-200 w-full h-0.5 my-1" />
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">Notes:</span>
                  <span className="font-normal text-xs text-black whitespace-pre-wrap">
                    {treatment.ivf.notes}
                  </span>
                </div>
              </>
            )}

            <div className="bg-gray-200 w-full h-0.5 my-1" />
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">IVF Status:</span>
              <span className="font-normal text-xs text-black px-2 py-1 rounded bg-gray-100">
                {treatment.ivf.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {treatment.treatmentType === "IUI" && (
        <div className="bg-gray-50 w-full p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-blue-500 mb-2">
            IUI Details
          </h2>

          <div className="flex flex-col gap-2">
            {treatment.iui.protocol && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Protocol:</span>
                <span className="font-normal text-xs text-black">
                  {treatment.iui.protocol}
                </span>
              </div>
            )}

            {treatment.iui.medications && (
              <>
                <div className="bg-gray-200 w-full h-0.5 my-1" />
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">Medications:</span>
                  <span className="font-normal text-xs text-black">
                    {treatment.iui.medications}
                  </span>
                </div>
              </>
            )}

            {treatment.iui.monitoring && (
              <>
                <div className="bg-gray-200 w-full h-0.5 my-1" />
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">Monitoring:</span>
                  <span className="font-normal text-xs text-black">
                    {treatment.iui.monitoring}
                  </span>
                </div>
              </>
            )}

            <div className="bg-gray-200 w-full h-0.5 my-1" />

            <div className="text-sm font-semibold mb-1">Important Dates:</div>
            {treatment.iui.ovulationTriggerDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Ovulation Trigger:</span>
                <span className="font-normal text-xs text-black">
                  {formatDate(treatment.iui.ovulationTriggerDate)}
                </span>
              </div>
            )}
            {treatment.iui.inseminationDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Insemination:</span>
                <span className="font-normal text-xs text-black">
                  {formatDate(treatment.iui.inseminationDate)}
                </span>
              </div>
            )}

            {(treatment.iui.motileSpermCount !== null ||
              treatment.iui.numberOfAttempts !== null) && (
              <>
                <div className="bg-gray-200 w-full h-0.5 my-1" />
                <div className="text-sm font-semibold mb-1">
                  Procedure Details:
                </div>
                {treatment.iui.motileSpermCount !== null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Motile Sperm Count:</span>
                    <span className="font-normal text-xs text-black">
                      {treatment.iui.motileSpermCount}
                    </span>
                  </div>
                )}
                {treatment.iui.numberOfAttempts !== null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Number of Attempts:</span>
                    <span className="font-normal text-xs text-black">
                      {treatment.iui.numberOfAttempts}
                    </span>
                  </div>
                )}
              </>
            )}

            {treatment.iui.outcome && (
              <>
                <div className="bg-gray-200 w-full h-0.5 my-1" />
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">Outcome:</span>
                  <span className="font-normal text-xs text-black">
                    {treatment.iui.outcome}
                  </span>
                </div>
              </>
            )}

            {treatment.iui.notes && (
              <>
                <div className="bg-gray-200 w-full h-0.5 my-1" />
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold">Notes:</span>
                  <span className="font-normal text-xs text-black whitespace-pre-wrap">
                    {treatment.iui.notes}
                  </span>
                </div>
              </>
            )}

            <div className="bg-gray-200 w-full h-0.5 my-1" />
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">IUI Status:</span>
              <span className="font-normal text-xs text-black px-2 py-1 rounded bg-gray-100">
                {treatment.iui.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
