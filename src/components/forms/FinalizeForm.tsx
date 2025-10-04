import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ResumeData } from '@/types/resume';
import { ResumePreview } from '@/components/ResumePreview';
import { ProfessionalResumeTemplate } from '@/components/ProfessionalResumeTemplate';
import { ProfessionalResumeTemplateWithPhoto } from '@/components/ProfessionalResumeTemplateWithPhoto';
import { Download, Eye, Share, FileText, CheckCircle, AlertCircle, Upload, User, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

interface FinalizeFormProps {
  data: ResumeData;
  score: number;
}

export const FinalizeForm = ({ data, score }: FinalizeFormProps) => {
  const { toast } = useToast();
  const [resumeFormat, setResumeFormat] = useState<'with-photo' | 'without-photo'>('without-photo');
  const [photoPreview, setPhotoPreview] = useState<string | null>(data.photo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      toast({
        title: "Photo Uploaded",
        description: "Your photo has been added to the resume",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPDF = async () => {
    const elementId = resumeFormat === 'with-photo' ? 'resume-preview-pdf-with-photo' : 'resume-preview-pdf';
    const resumeElement = document.getElementById(elementId);
    
    if (!resumeElement) {
      toast({
        title: "Error",
        description: "Resume preview not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (resumeFormat === 'with-photo' && !photoPreview) {
      toast({
        title: "Photo Required",
        description: "Please upload a photo for the resume with photo format",
        variant: "destructive"
      });
      return;
    }

    try {
      const opt = {
        margin: 0.5,
        filename: `${data.contacts.firstName}_${data.contacts.lastName}_Resume_${resumeFormat}.pdf`,
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
          height: 11 * 96,
          width: 8.5 * 96
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
        description: `Your resume has been saved as a PDF file ${resumeFormat === 'with-photo' ? 'with photo' : 'without photo'}.`,
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

      {/* Resume Format Selection */}
      <Card className="p-6 border border-border shadow-soft">
        <h3 className="font-semibold text-foreground mb-4">Choose Resume Format</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => setResumeFormat('without-photo')}
            className={`p-4 border-2 rounded-lg transition-all ${
              resumeFormat === 'without-photo'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <FileText className={`w-8 h-8 ${resumeFormat === 'without-photo' ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="font-medium text-foreground">Without Photo</div>
              <div className="text-xs text-muted-foreground text-center">Classic professional format</div>
            </div>
          </button>

          <button
            onClick={() => setResumeFormat('with-photo')}
            className={`p-4 border-2 rounded-lg transition-all ${
              resumeFormat === 'with-photo'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <UserCircle className={`w-8 h-8 ${resumeFormat === 'with-photo' ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="font-medium text-foreground">With Photo</div>
              <div className="text-xs text-muted-foreground text-center">Modern format with profile picture</div>
            </div>
          </button>
        </div>

        {/* Photo Upload Section */}
        {resumeFormat === 'with-photo' && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-start space-x-4">
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Profile preview" 
                    className="w-24 h-24 rounded-lg object-cover border-2 border-primary"
                  />
                  <button
                    onClick={() => {
                      setPhotoPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-background">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">Upload Your Photo</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose a professional photo (JPG, PNG, max 5MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </div>
            </div>
          </div>
        )}
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
              <DialogTitle>Resume Preview ({resumeFormat === 'with-photo' ? 'With Photo' : 'Without Photo'})</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {resumeFormat === 'with-photo' ? (
                <ProfessionalResumeTemplateWithPhoto data={{ ...data, photo: photoPreview || undefined }} />
              ) : (
                <ResumePreview data={data} />
              )}
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
        <div id="resume-preview-pdf-with-photo">
          <ProfessionalResumeTemplateWithPhoto data={{ ...data, photo: photoPreview || undefined }} />
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