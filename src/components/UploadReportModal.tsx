import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface UploadReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export const UploadReportModal = ({ open, onOpenChange, onUploadSuccess }: UploadReportModalProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('medical-reports')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medical-reports')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          report_date: date,
          notes: notes || null
        });

      if (dbError) throw dbError;

      toast.success('Report uploaded successfully!');
      onUploadSuccess();
      onOpenChange(false);
      
      // Reset form
      setFile(null);
      setDate('');
      setNotes('');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to upload report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Medical Report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, PNG, DOC up to 10MB
                </p>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Report Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Doctor name, prescription details, diagnosis, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="coral" disabled={loading || !file}>
              {loading ? 'Uploading...' : 'Upload Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
