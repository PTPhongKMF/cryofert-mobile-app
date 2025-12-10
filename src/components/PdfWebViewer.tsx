import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Viewer, Worker, type ViewerProps } from "@react-pdf-viewer/core";
import { cn } from "@src/utils/cn";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PdfWebViewerProps {
  fileUrl?: ViewerProps["fileUrl"];
  className?: string;
}

export default function PdfWebViewer({ fileUrl, className }: PdfWebViewerProps) {
  const defaultLayout = defaultLayoutPlugin();

  if (!fileUrl) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center text-sm text-slate-500",
          className
        )}
      >
        No PDF to display
      </div>
    );
  }

  return (
    <Worker workerUrl="/workers/pdf.worker.min.js">
      <div className={cn("size-full", className)}>
        <Viewer fileUrl={fileUrl} plugins={[defaultLayout]} />
      </div>
    </Worker>
  );
}
