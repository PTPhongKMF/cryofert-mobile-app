import { IonIcon, IonSpinner } from "@ionic/react";
import { useLabSampleInfiniteQuery } from "@src/hooks/lab-sample-hook";
import { useLocalUserStore } from "@src/stores/user";
import type { ReactNode } from "react";
import eggIcon from "@assets/images/icons/egg.svg";
import spermIcon from "@assets/images/icons/sperm.svg";
import embryoIcon from "@assets/images/icons/embryo.svg";

interface SampleCard {
  title: string;
  icon: ReactNode;
  type: "Oocyte" | "Sperm" | "Embryo";
}

export default function FrozenSampleStatus() {
  const localUser = useLocalUserStore((s) => s.localUser);
  const patientId = localUser?.id || "";

  const cards: SampleCard[] = [
    {
      title: "Egg",
      icon: <IonIcon icon={eggIcon} className="size-6 text-blue-600" />,
      type: "Oocyte",
    },
    {
      title: "Sperm",
      icon: <IonIcon icon={spermIcon} className="size-6 text-blue-600" />,
      type: "Sperm",
    },
    {
      title: "Embryo",
      icon: <IonIcon icon={embryoIcon} className="size-6 text-blue-600" />,
      type: "Embryo",
    },
  ];

  const queries = cards.map((card) =>
    useLabSampleInfiniteQuery(patientId, 100, {
      type: card.type,
      status: "Frozen",
      sortType: "LatestCollection",
    })
  );

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card, idx) => {
        const query = queries[idx];
        const total = query.isError
          ? 0
          : query.data?.pages.reduce((acc, page) => acc + page.data.length, 0) ??
            0;

        return (
          <div
            key={card.title}
            className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl border border-blue-50 bg-white/70"
          >
            {card.icon}

            <div className="flex justify-center items-center">
              {query.isPending ? (
                <IonSpinner name="dots" className="text-blue-600 size-5" />
              ) : (
                <span className="text-lg font-semibold text-gray-900">
                  {total > 99 ? "99+" : total}
                </span>
              )}
            </div>

            <span className="text-xs uppercase tracking-wide text-gray-500">
              {card.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
