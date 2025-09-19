import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Sparkles, Lightbulb } from 'lucide-react';

interface SummaryFormProps {
  data: string;
  onChange: (summary: string) => void;
}

export const SummaryForm = ({ data, onChange }: SummaryFormProps) => {
  const generateSummary = async () => {
    // Mock AI generation - in real app, this would call an AI API
    const sample = `Experienced professional with a proven track record of delivering high-quality results and driving organizational success. Skilled in cross-functional collaboration, strategic planning, and process optimization. Passionate about leveraging technology and innovation to solve complex business challenges and create value for stakeholders.`;
    
    onChange(sample);
  };

  const summaryTips = [
    "Keep it concise (3-4 sentences or 50-100 words)",
    "Start with your years of experience or current role",
    "Highlight your key skills and achievements", 
    "Mention the value you bring to employers",
    "Use keywords from your target job descriptions"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Professional Summary</h2>
        <p className="text-muted-foreground">
          Write a compelling summary that highlights your key qualifications and value proposition.
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-primary mb-2">Summary Writing Tips</h3>
            <ul className="text-sm text-primary/80 space-y-1">
              {summaryTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1 h-1 bg-primary/60 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            className="text-primary hover:text-primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate with AI
          </Button>
        </div>
        
        <RichTextEditor
          value={data}
          onChange={onChange}
          placeholder="Experienced professional with a proven track record of delivering high-quality results and driving organizational success. Skilled in cross-functional collaboration, strategic planning, and process optimization..."
          className="min-h-[200px]"
        />
        
        <div className="text-sm text-muted-foreground">
          Current length: {data.length} characters
          {data.length < 50 && " (aim for 50+ characters)"}
          {data.length > 400 && " (consider shortening)"}
        </div>
      </div>

      {data.length > 50 && (
        <div className="bg-stepper-complete/10 border border-stepper-complete/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-stepper-complete text-sm">
            <div className="w-2 h-2 bg-stepper-complete rounded-full" />
            <span>Great! Your summary looks good and meets the recommended length.</span>
          </div>
        </div>
      )}
    </div>
  );
};