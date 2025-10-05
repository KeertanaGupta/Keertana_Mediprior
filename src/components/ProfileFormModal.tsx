import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileFormModal = ({ open, onOpenChange }: ProfileFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    gender: '',
    weight: '',
    height: '',
    substance_use: '',
    history: ''
  });

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data && !error) {
      setFormData({
        name: data.name || '',
        age: data.age?.toString() || '',
        dob: data.dob || '',
        gender: data.gender || '',
        weight: data.weight?.toString() || '',
        height: data.height?.toString() || '',
        substance_use: data.substance_use || '',
        history: data.history || ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
          age: formData.age ? parseInt(formData.age) : null,
          dob: formData.dob || null,
          gender: formData.gender || null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          substance_use: formData.substance_use || null,
          history: formData.history || null
        });

      if (error) throw error;

      toast.success('Profile saved successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Health Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="substance_use">Substance Use</Label>
            <Textarea
              id="substance_use"
              placeholder="Alcohol, tobacco, prescribed medications, etc."
              value={formData.substance_use}
              onChange={(e) => handleChange('substance_use', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="history">Medical History</Label>
            <Textarea
              id="history"
              placeholder="Diseases, injuries, operations, transplants, etc."
              value={formData.history}
              onChange={(e) => handleChange('history', e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="coral" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
