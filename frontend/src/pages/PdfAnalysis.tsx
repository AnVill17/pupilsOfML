import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzePdf } from "../backendfunctions/diseaseP";
const PdfAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<string[][] | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setCsvData(null);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
    }
  };
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const handleUpload = async () => {
  if (!file) return;

  setIsProcessing(true);
  setUploadProgress(0);
  setCsvData(null);

  try {
    // call helper; optional progress callback
    const result = await analyzePdf(file, (percent) => {
      setUploadProgress(percent);
    });

    // result is string[][] (rows × cols)
    setCsvData(result);
    toast({
      title: "Analysis complete",
      description: "PDF processed successfully"
    });
  } catch (err: any) {
    console.error("PDF analysis failed:", err?.message || err);
    toast({
      title: "Analysis failed",
      description: err?.message || "Unable to analyze PDF",
      variant: "destructive"
    });
  } finally {
    setIsProcessing(false);
    setUploadProgress(null);
  }
};

  const downloadCsv = () => {
    if (!csvData) return;
    
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analysis_result.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">PDF Analysis</h1>
          <p className="text-muted-foreground">
            Upload mining reports for automated data extraction and analysis
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {file ? file.name : "Click to upload PDF"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mining reports, safety logs, inspection documents
                  </p>
                </label>
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={!file || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Analysis Results</CardTitle>
              {csvData && (
                <Button variant="outline" size="sm" onClick={downloadCsv}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!csvData ? (
                <div className="text-center py-12 text-muted-foreground">
                  Upload and analyze a document to see results
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        {csvData[0].map((header, i) => (
                          <th key={i} className="border border-border px-4 py-2 text-left text-sm font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(1).map((row, i) => (
                        <tr key={i} className="hover:bg-muted/50">
                          {row.map((cell, j) => (
                            <td key={j} className="border border-border px-4 py-2 text-sm">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PdfAnalysis;
