import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import { httpClient } from "@src/services/api-services/http-service";
import { useEffect, useState } from "react";
import { set } from "valibot";

export default function TestPage() {
  const [html, setHtml] = useState<string>("");

  const router = useIonRouter();

  useEffect(() => {
    (async () => {
      const res: any = await httpClient
        .get(
          "api/cryostoragecontracts/08de2797-df5e-448a-8a3b-bb04898c12fd/contract-html"
        )
        .json();

      console.log("res: ", res);

      // const blob = new Blob([res.contract], { type: "text/html" });
      // setHtml(URL.createObjectURL(blob));

      setHtml(res.data.contract);
    })();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Test 1</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="relative">
        <IonButton onClick={() => router.push("/test2", "forward", "replace")}>
          go
        </IonButton>

        <iframe
          title="contract-html"
          srcDoc={html}
          className="w-full h-full border-0"
        ></iframe>
      </IonContent>
    </IonPage>
  );
}
