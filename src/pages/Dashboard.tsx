import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { HealthCard } from '@/components/HealthCard';
import { ProfileFormModal } from '@/components/ProfileFormModal';
import { UploadReportModal } from '@/components/UploadReportModal';
import { ConnectWatchModal } from '@/components/ConnectWatchModal';
import { Heart, Activity, Footprints, Upload, User, Calendar as CalendarIcon, Watch, FileText, Download } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Report {
  id: string;
  fileName: string;
  date: string;
  notes: string;
  url: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [watchModalOpen, setWatchModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
    loadReports();
  }, [user, navigate]);

  const loadUserData = async () => {
    if (!user) return;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      setProfileComplete(userDoc.data()?.profileComplete || false);
    }
  };

  const loadReports = async () => {
    if (!user) return;

    const q = query(collection(db, 'reports'), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const reportsData: Report[] = [];
    querySnapshot.forEach((doc) => {
      reportsData.push({ id: doc.id, ...doc.data() } as Report);
    });
    setReports(reportsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Health Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your health overview.</p>
        </div>

        {/* Health Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <HealthCard
            icon={Heart}
            title="Heart Rate"
            value="72"
            unit="bpm"
            color="accent"
          />
          <HealthCard
            icon={Footprints}
            title="Steps Today"
            value="4,201"
            unit="steps"
            color="primary"
          />
          <HealthCard
            icon={Activity}
            title="SpO₂ Level"
            value="98"
            unit="%"
            color="secondary"
          />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Reports & Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Medical Reports */}
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Medical Reports</h2>
                </div>
                <Button variant="coral" onClick={() => setUploadModalOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Report
                </Button>
              </div>

              <div className="space-y-3">
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No reports uploaded yet</p>
                    <p className="text-sm">Upload your first medical report to get started</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium">{report.fileName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{report.notes || 'No notes'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Date: {new Date(report.date).toLocaleDateString()}
                        </p>
                      </div>
                      <a href={report.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Profile Section */}
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Health Profile</h2>
                    <p className="text-sm text-muted-foreground">
                      {profileComplete ? 'Profile completed' : 'Complete your profile'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setProfileModalOpen(true)}>
                  {profileComplete ? 'Edit Profile' : 'Complete Profile'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar & Quick Actions */}
          <div className="space-y-6">
            {/* Connect Watch */}
            <div className="card-elegant p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Watch className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Smartwatch</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your device to sync vitals automatically
              </p>
              <Button variant="outline" className="w-full" onClick={() => setWatchModalOpen(true)}>
                Connect Device
              </Button>
            </div>

            {/* Appointments Calendar */}
            <div className="card-elegant p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Appointments</h2>
              </div>
              <div className="[&_.react-calendar]:w-full [&_.react-calendar]:border-0 [&_.react-calendar]:font-sans [&_.react-calendar_button]:rounded-lg [&_.react-calendar__tile--active]:bg-primary [&_.react-calendar__tile--active]:text-white">
                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                />
              </div>
              {selectedDate && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Selected: {selectedDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileFormModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
      <UploadReportModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
        onUploadSuccess={loadReports}
      />
      <ConnectWatchModal open={watchModalOpen} onOpenChange={setWatchModalOpen} />
    </div>
  );
};

export default Dashboard;
