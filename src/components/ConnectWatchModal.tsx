import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Watch } from 'lucide-react';

interface ConnectWatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConnectWatchModal = ({ open, onOpenChange }: ConnectWatchModalProps) => {
  const [device, setDevice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!device) {
      toast.error('Please select a device');
      return;
    }

    setLoading(true);
    // Simulate connection delay
    setTimeout(() => {
      toast.success('Vitals data synced successfully!');
      setLoading(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Watch className="w-5 h-5 text-primary" />
            Connect Smartwatch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="device">Select Device</Label>
            <Select value={device} onValueChange={setDevice}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your smartwatch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google-fit">Google Fit</SelectItem>
                <SelectItem value="fitbit">Fitbit</SelectItem>
                <SelectItem value="demo">Demo Smartwatch</SelectItem>
                <SelectItem value="simulated">Simulated FitBand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
            <p>
              Once connected, your vitals (heart rate, steps, SpO₂) will appear on your dashboard automatically.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="coral" onClick={handleConnect} disabled={loading || !device}>
              {loading ? 'Connecting...' : 'Connect Device'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
