import { FileText, File } from "lucide-react";

export const getFileIcon = (fileName: string): React.ReactNode => {
  if (fileName.endsWith(".csv")) {
    return <FileText className="w-5 h-5 text-green-600" />;
  } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    return <FileText className="w-5 h-5 text-blue-600" />;
  }
  return <File className="w-5 h-5 text-gray-600" />;
};
