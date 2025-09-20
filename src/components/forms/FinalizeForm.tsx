import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ResumeData } from '@/types/resume';
import { ResumePreview } from '@/components/ResumePreview';
import { ProfessionalResumeTemplate } from '@/components/ProfessionalResumeTemplate';
import { Download, Eye, Share, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2pdf from 'html2pdf.js';

interface FinalizeFormProps {
  data: ResumeData;
  score: number;
}

export const FinalizeForm = ({ data, score }: FinalizeFormProps) => {
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    const resumeElement = document.getElementById('resume-preview-pdf');
    if (!resumeElement) {
      toast({
        title: "Error",
        description: "Resume preview not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      const opt = {
        margin: 0.5,
        filename: `${data.contacts.firstName}_${data.contacts.lastName}_Resume.pdf`,
        image: { 
          type: 'jpeg' as const, 
          quality: 1.0 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          dpi: 300,
          height: 11 * 96, // 11 inches at 96 DPI
          width: 8.5 * 96  // 8.5 inches at 96 DPI
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' as const,
          compress: true
        }
      };

      await html2pdf().set(opt).from(resumeElement).save();
      
      toast({
        title: "PDF Downloaded!",
        description: "Your resume has been saved as a PDF file.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    // Mock sharing - in real app, this would generate shareable link
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Resume link has been copied to clipboard.",
    });
  };

  const getCompletionStatus = () => {
    const sections = [
      { name: 'Contact Information', completed: !!(data.contacts.firstName && data.contacts.lastName && data.contacts.email) },
      { name: 'Professional Summary', completed: data.summary.length > 50 },
      { name: 'Work Experience', completed: data.experience.length > 0 },
      { name: 'Education', completed: data.education.length > 0 },
      { name: 'Skills', completed: data.skills.length >= 3 },
    ];

    return sections;
  };

  const sections = getCompletionStatus();
  const completedSections = sections.filter(s => s.completed).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Finalize Your Resume</h2>
        <p className="text-muted-foreground">
          Review your resume, check completeness, and download your professional resume.
        </p>
      </div>

      {/* Completion Status */}
      <Card className="p-6 border border-border shadow-soft">
        <h3 className="font-semibold text-foreground mb-4">Resume Completion Status</h3>
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="flex items-center space-x-3">
              {section.completed ? (
                <CheckCircle className="w-5 h-5 text-stepper-complete" />
              ) : (
                <AlertCircle className="w-5 h-5 text-warning" />
              )}
              <span className={section.completed ? "text-foreground" : "text-muted-foreground"}>
                {section.name}
              </span>
              {section.completed && (
                <span className="text-xs bg-stepper-complete/10 text-stepper-complete px-2 py-1 rounded-full">
                  Complete
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sections completed:</span>
            <span className="font-medium text-foreground">{completedSections}/{sections.length}</span>
          </div>
        </div>
      </Card>

      {/* Resume Statistics */}
      <Card className="p-6 border border-border shadow-soft">
        <h3 className="font-semibold text-foreground mb-4">Resume Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{data.experience.length}</div>
            <div className="text-sm text-muted-foreground">Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{data.education.length}</div>
            <div className="text-sm text-muted-foreground">Education</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{data.skills.length}</div>
            <div className="text-sm text-muted-foreground">Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{data.certificates.length}</div>
            <div className="text-sm text-muted-foreground">Certificates</div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-12 text-left flex items-center space-x-3"
            >
              <Eye className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Preview Resume</div>
                <div className="text-xs text-muted-foreground">View before download</div>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Resume Preview</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <ResumePreview data={data} />
            </div>
          </DialogContent>
        </Dialog>

        <Button
          onClick={handleDownloadPDF}
          className="h-12 text-left flex items-center space-x-3"
          disabled={score < 40}
        >
          <Download className="w-5 h-5" />
          <div>
            <div className="font-medium">Download PDF</div>
            <div className="text-xs opacity-80">Professional format</div>
          </div>
        </Button>

        <Button
          onClick={handleShare}
          variant="outline"
          className="h-12 text-left flex items-center space-x-3"
        >
          <Share className="w-5 h-5 text-primary" />
          <div>
            <div className="font-medium">Share Resume</div>
            <div className="text-xs text-muted-foreground">Copy shareable link</div>
          </div>
        </Button>
      </div>

      {/* Hidden Resume for PDF Generation */}
      <div className="hidden">
        <div id="resume-preview-pdf">
          <ProfessionalResumeTemplate data={data} />
        </div>
      </div>

      {score < 40 && (
        <Card className="p-4 border border-warning/30 bg-warning/5">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div>
              <h4 className="font-medium text-warning mb-1">Resume Needs Improvement</h4>
              <p className="text-sm text-warning/80">
                Your resume score is below 40%. Please go back and complete more sections to improve your resume before downloading.
              </p>
            </div>
          </div>
        </Card>
      )}

      {score >= 70 && (
        <Card className="p-4 border border-stepper-complete/30 bg-stepper-complete/5">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-stepper-complete mt-0.5" />
            <div>
              <h4 className="font-medium text-stepper-complete mb-1">Excellent Resume!</h4>
              <p className="text-sm text-stepper-complete/80">
                Your resume looks great and is ready to impress employers. You can download it with confidence!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};