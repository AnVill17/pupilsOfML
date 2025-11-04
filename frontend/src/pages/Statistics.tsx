import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Statistics = () => {
  const stats = [
    {
      title: "Mining Fatalities by Year",
      description: "Leading Causes of Mining Accidents.Bar chart showing other and machinery as the most frequent mining accident causes in India.",
      image: "/WhatsApp Image 2025-11-04 at 23.24.16_5fe0d21a.jpg"
    },
    {
      title: "Accident Types Distribution",
      description: "Accident Report Clustering (PCA 2D).Scatter plot grouping similar accident summaries into colored clusters using PCA.",
      image: "public/WhatsApp Image 2025-11-04 at 23.25.29_1f61d690.jpg"
    },
    {
      title: "Accident .",
      description: "Predicted Accident Causes.Bar chart showing struck by object as the most frequent predicted accident cause.",
      image: "public/WhatsApp Image 2025-11-04 at 23.26.54_01198a2e.jpg"
    },
    {
      title: "Regional Safety Comparison",
      description: "Fatalities by State.Bar chart ranking states by fatalities, with Rajasthan having the most.",
      image: "public/WhatsApp Image 2025-11-04 at 23.28.17_08464681.jpg"
    },
    {
      title: "Regional Safety Comparison",
      description: "Accident Frequency by Location.Bar chart ranking accident locations, led by plant sites and transportation road/sites.",
      image: "public/WhatsApp Image 2025-11-04 at 23.29.13_80244387.jpg"
    },
    {
      title: "Regional Safety Comparison",
      description: "Accident Severity Index.Bar chart showing fire is the most severe cause, averaging the most fatalities.",
      image: "public/WhatsApp Image 2025-11-04 at 23.30.25_a4618179.jpg"
    },
    {
      title: "Regional Safety Comparison",
      description: "Accident Frequency by Month.Bar chart showing accident counts per month, peaking in October.",
      image: "public/WhatsApp Image 2025-11-04 at 23.31.26_e23045b8.jpg"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Mining Statistics</h1>
          <p className="text-muted-foreground">
            Visual data representation of mining safety and incidents
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {stats.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <img 
                    src={stat.image} 
                    alt={stat.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Statistics;
