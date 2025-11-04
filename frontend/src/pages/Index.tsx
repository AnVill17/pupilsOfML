import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, MessageSquare, FileText, Shield } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Mining Statistics",
      description: "Access comprehensive data on mining safety incidents, fatalities, and trends",
      link: "/statistics"
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Get instant answers about mining safety regulations and best practices",
      link: "/chatbot"
    },
    {
      icon: FileText,
      title: "PDF Analysis",
      description: "Upload mining reports for automated data extraction and insights",
      link: "/pdf-analysis"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Mining Safety Awareness
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Comprehensive platform for mining safety data, AI-powered assistance, 
              and intelligent document analysis
            </p>
            <Button size="lg" asChild>
              <Link to="/statistics">Explore Statistics</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={feature.link}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Commitment to Safety
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides the tools and information needed to understand, 
              analyze, and improve mining safety standards worldwide.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
