import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skill } from '@/types/resume';
import { Plus, X } from 'lucide-react';

interface SkillsFormProps {
  data: Skill[];
  onAddSkill: (skill: Omit<Skill, 'id'>) => void;
  onUpdateSkill: (id: string, updates: Partial<Skill>) => void;
  onRemoveSkill: (id: string) => void;
}

const skillCategories = [
  'Technical Skills',
  'Programming Languages',
  'Frameworks & Libraries',
  'Databases',
  'Tools & Software',
  'Design',
  'Project Management',
  'Communication',
  'Leadership',
  'Languages',
  'Other'
];

const skillLevels: Array<Skill['level']> = ['Not specified', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const SkillsForm = ({ 
  data, 
  onAddSkill, 
  onUpdateSkill, 
  onRemoveSkill 
}: SkillsFormProps) => {
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: 'Not specified',
    category: 'Technical Skills'
  });

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      onAddSkill(newSkill);
      setNewSkill({
        name: '',
        level: 'Not specified',
        category: 'Technical Skills'
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const groupedSkills = data.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Skills</h2>
        <p className="text-muted-foreground">
          Add your technical and soft skills. Include programming languages, tools, and other relevant abilities.
        </p>
      </div>

      {/* Add New Skill */}
      <Card className="p-6 border border-primary/30 shadow-soft">
        <h3 className="font-semibold text-foreground mb-4">Add New Skill</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Skill Name</Label>
            <Input
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., JavaScript, Project Management"
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={newSkill.category} 
              onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {skillCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Level</Label>
            <Select 
              value={newSkill.level} 
              onValueChange={(value: Skill['level']) => setNewSkill(prev => ({ ...prev, level: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleAddSkill} disabled={!newSkill.name.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </Card>

      {/* Skills Display */}
      {Object.keys(groupedSkills).length > 0 && (
        <div className="space-y-6">
          <h3 className="font-semibold text-foreground">Added Skills ({data.length})</h3>
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <Card key={category} className="p-6 border border-border shadow-soft">
              <h4 className="font-medium text-foreground mb-3">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="px-3 py-1 text-sm group hover:bg-destructive/10 transition-colors"
                  >
                    <span className="mr-2">{skill.name}</span>
                    {skill.level !== 'Not specified' && (
                      <span className="text-xs text-muted-foreground mr-2">({skill.level})</span>
                    )}
                    <button
                      onClick={() => onRemoveSkill(skill.id)}
                      className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {data.length === 0 && (
        <Card className="p-8 border-dashed border-2 border-border">
          <div className="text-center text-muted-foreground">
            <div className="text-lg mb-2">No skills added yet</div>
            <div className="text-sm">Add your first skill using the form above</div>
          </div>
        </Card>
      )}
    </div>
  );
};