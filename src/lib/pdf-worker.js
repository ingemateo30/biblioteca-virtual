import { pdfjs } from "react-pdf";

// Asegura que el worker usa la misma versión instalada
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

