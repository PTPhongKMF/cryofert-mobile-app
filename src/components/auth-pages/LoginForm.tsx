import { IonButton, IonIcon, IonInput } from "@ionic/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@src/components/libs/shadcn/InputGroup";
import type { LoginRequest } from "@src/schemas/auths/login";
import {
  closeCircle,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
} from "ionicons/icons";
import { useState } from "react";

export default function LoginForm() {
  const [loginReq, setLoginReq] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form // onSubmit={onSubmit}
    className="grid h-full grid-rows-[4rem_4rem_2fr_1fr] items-center gap-2 px-6 py-10">
      <InputGroup className="bg-white h-12 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-300 
       has-[[data-slot=input-group-control]:focus-visible]:border-blue-300 
       has-[[data-slot=input-group-control]:focus-visible]:ring-[1px]
       pe-1">
        <InputGroupInput
          type="email"
          placeholder="Email"
          value={loginReq.email}
          onChange={(e) =>
            setLoginReq((prev) => ({ ...prev, email: e.target.value }))}
          className="bg-white"
        />

        <InputGroupAddon>
          <IonIcon icon={mailOutline} className="text-black" />
        </InputGroupAddon>

        {loginReq.email && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              onClick={() => setLoginReq((prev) => ({ ...prev, email: "" }))}
            >
              <IonIcon icon={closeCircle} />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <InputGroup className="bg-white h-12 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-300 
       has-[[data-slot=input-group-control]:focus-visible]:border-blue-300 
       has-[[data-slot=input-group-control]:focus-visible]:ring-[1px]
       pe-1">
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          value={loginReq.password}
          onChange={(e) =>
            setLoginReq((prev) => ({ ...prev, password: e.target.value }))}
          className="bg-white"
        />

        <InputGroupAddon>
          <IonIcon icon={lockClosedOutline} className="text-black" />
        </InputGroupAddon>

        {loginReq.password && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              onClick={() => setLoginReq((prev) => ({ ...prev, password: "" }))}
            >
              <IonIcon icon={closeCircle} />
            </InputGroupButton>
          </InputGroupAddon>
        )}

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <IonIcon
              icon={showPassword ? eyeOffOutline : eyeOutline}
              className="size-5"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <IonButton type="submit">Đăng Nhập</IonButton>
    </form>
  );
}
