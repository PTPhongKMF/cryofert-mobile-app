import { IonContent } from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";

export default function Home() {
  return (
    <IonContent>
      <SafeAreaView className="flex flex-col justify-center items-center bg-blue-200">
        <div>Xin chào các bạn cô chú các bác</div>
      </SafeAreaView>
    </IonContent>
  );
}
