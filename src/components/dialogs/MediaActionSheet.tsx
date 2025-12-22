import React, { useState } from "react";
import { IonActionSheet } from "@ionic/react";
import type { MediaResponse } from "@src/schemas/media";
import { useGenericDialogStore } from "@src/stores/dialog";
import GenericViewPdfDialog from "@src/components/dialogs/GenericViewPdfDialog";
import { PhotoViewer } from "@capacitor-community/photoviewer";

export interface MediaActionSheetProps {
  media: MediaResponse | null;
  onClose: () => void;
}

export default function MediaActionSheet({ media, onClose }: MediaActionSheetProps) {
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const [pdfViewerIsOpen, setPdfViewerIsOpen] = useState(false);
  const [viewerFileUrl, setViewerFileUrl] = useState<string | undefined>(undefined);
  const [viewerTitle, setViewerTitle] = useState<string | undefined>(undefined);

  function handleView(target: MediaResponse | null) {
    if (!target) return onClose();

    const mime = (target.fileType ?? "").toLowerCase();
    const fileUrl = target.filePath;
    const title = target.originalFileName;

    if (mime === "application/pdf" || mime.includes("pdf")) {
      setViewerFileUrl(fileUrl);
      setViewerTitle(title);
      setPdfViewerIsOpen(true);
      onClose();
      return;
    }

    if (mime.startsWith("image/")) {
      PhotoViewer.show({ images: [{ url: fileUrl }] });
      onClose();
      return;
    }

    openGenericDialog({
      title: "Unsupported file type",
      content: target.fileType,
      svgIconColor: "warning",
    });
    onClose();
  };

  function handleDownload(target: MediaResponse | null) {
    if (!target) return onClose();

    console.log("media:download", target);
    openGenericDialog({
      title: "Not implemented",
      content: "Download is a work in progress.",
      svgIconColor: "warning",
    });
    onClose();
  };

  const header = media?.originalFileName ?? "Media";

  return (
    <>
      <IonActionSheet
        isOpen={media !== null}
        onDidDismiss={onClose}
        header={header}
        buttons={[
          {
            text: "View",
            handler: () => {
              handleView(media);
            },
          },
          {
            text: "Download (work in progress)",
            handler: () => {
              handleDownload(media);
            },
          },
          {
            text: "Cancel",
            role: "cancel" as const,
          },
        ]}
      />

      <GenericViewPdfDialog
        isOpen={pdfViewerIsOpen}
        setIsOpen={setPdfViewerIsOpen}
        fileUrl={viewerFileUrl}
        title={viewerTitle ?? "PDF Viewer"}
      />
    </>
  );
}
