import React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jeep-photoviewer": any;
    }
  }
}
