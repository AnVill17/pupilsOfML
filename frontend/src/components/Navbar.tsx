import { Link, useLocation } from "react-router-dom";
import { Activity } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Activity className="h-6 w-6" />
            Mining Awareness
          </Link>
          
          <div className="flex gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/statistics" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/statistics") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Statistics
            </Link>
            <Link 
              to="/chatbot" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/chatbot") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              AI Assistant
            </Link>
            <Link 
              to="/pdf-analysis" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/pdf-analysis") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              PDF Analysis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
