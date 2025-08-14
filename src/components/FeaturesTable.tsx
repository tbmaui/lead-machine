import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FeaturesTable = () => {
  const features = [
    {
      feature: "Targeted Search",
      description: "Filter by industry, job title, location, and company size."
    },
    {
      feature: "Cross-Verification", 
      description: "Email and phone validation for higher deliverability."
    },
    {
      feature: "LinkedIn Enrichment",
      description: "Profile data for personalization."
    },
    {
      feature: "Bulk Export",
      description: "Export up to 1,000 records, spreadsheet/CRM-ready."
    },
    {
      feature: "Speed + Scale",
      description: "Designed for daily use; no throttling in the demo."
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Key Features & Functionality</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Feature</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-sm">{item.feature}</TableCell>
                <TableCell className="text-sm">{item.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FeaturesTable;