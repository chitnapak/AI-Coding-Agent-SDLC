declare module "swagger-ui-react" {
  import type { ComponentType } from "react";

  interface SwaggerUIProps {
    url?: string;
    docExpansion?: "list" | "full" | "none";
    defaultModelsExpandDepth?: number;
    displayRequestDuration?: boolean;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}
