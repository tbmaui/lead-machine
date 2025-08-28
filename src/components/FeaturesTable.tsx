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
    <div className="neu-card neu-gradient-stroke p-8">
      <h3 className="text-lg font-semibold mb-6">Key Features & Functionality</h3>
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
    </div>
  );
};

export default FeaturesTable;