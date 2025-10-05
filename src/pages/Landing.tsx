import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, FileText, Activity, Calendar } from 'lucide-react';
import dashboardPreview from '@/assets/dashboard-preview.jpg';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 -z-10" />
        
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border/50 mb-6 shadow-sm">
            <Heart className="w-4 h-4 text-accent" fill="currentColor" />
            <span className="text-sm text-muted-foreground">Your Smart Health Companion</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Take Control of Your Health Journey
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Store medical reports, track your vitals, connect your smartwatch, and share everything seamlessly with your healthcare providers.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button variant="coral" size="lg" className="text-base">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="card-elegant overflow-hidden">
            <img 
              src={dashboardPreview} 
              alt="Mediprior Dashboard Preview" 
              className="w-full h-auto"
            />
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Store Reports</h3>
              <p className="text-sm text-muted-foreground">Keep all medical documents organized in one place</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Track Vitals</h3>
              <p className="text-sm text-muted-foreground">Monitor heart rate, steps, and oxygen levels daily</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Connect Watch</h3>
              <p className="text-sm text-muted-foreground">Sync data from your smartwatch automatically</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Book Appointments</h3>
              <p className="text-sm text-muted-foreground">Schedule and manage doctor visits easily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Patients & Doctors</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-elegant p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="w-5 h-5 text-accent" fill="currentColor" />
                ))}
              </div>
              <p className="text-lg mb-4 text-muted-foreground italic">
                "I keep all my reports here — easy to share with my doctor. No more searching through papers during appointments!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full" />
                <div>
                  <p className="font-semibold">Anita Sharma</p>
                  <p className="text-sm text-muted-foreground">Patient</p>
                </div>
              </div>
            </div>
            
            <div className="card-elegant p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="w-5 h-5 text-accent" fill="currentColor" />
                ))}
              </div>
              <p className="text-lg mb-4 text-muted-foreground italic">
                "Organized reports save my time during consultations. I can quickly review patient history and make better decisions."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full" />
                <div>
                  <p className="font-semibold">Dr. Rajesh Mehra</p>
                  <p className="text-sm text-muted-foreground">Cardiologist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Mediprior. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
