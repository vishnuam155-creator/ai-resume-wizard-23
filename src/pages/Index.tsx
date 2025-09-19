import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useResumeData } from '@/hooks/useResumeData';
import { ResumeStepper } from '@/components/ResumeStepper';
import { ResumeScore } from '@/components/ResumeScore';
import { ResumePreview } from '@/components/ResumePreview';
import { ContactsForm } from '@/components/forms/ContactsForm';
import { ExperienceForm } from '@/components/forms/ExperienceForm';
import { EducationForm } from '@/components/forms/EducationForm';
import { SkillsForm } from '@/components/forms/SkillsForm';
import { SummaryForm } from '@/components/forms/SummaryForm';
import { FinalizeForm } from '@/components/forms/FinalizeForm';
import { ResumeStep } from '@/types/resume';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Index = () => {
  const {
    resumeData,
    currentStep,
    setCurrentStep,
    updateContacts,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    calculateCompletionScore,
    getStepCompletionStatus
  } = useResumeData();

  const steps: ResumeStep[] = ['contacts', 'experience', 'education', 'skills', 'summary', 'finalize'];
  const currentStepIndex = steps.indexOf(currentStep);
  const score = calculateCompletionScore();

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const renderStepForm = () => {
    switch (currentStep) {
      case 'contacts':
        return <ContactsForm data={resumeData.contacts} onChange={updateContacts} />;
      case 'experience':
        return (
          <ExperienceForm
            data={resumeData.experience}
            onChange={() => {}} // Not used with individual handlers
            onAddExperience={addExperience}
            onUpdateExperience={updateExperience}
            onRemoveExperience={removeExperience}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={resumeData.education}
            onAddEducation={addEducation}
            onUpdateEducation={updateEducation}
            onRemoveEducation={removeEducation}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            data={resumeData.skills}
            onAddSkill={addSkill}
            onUpdateSkill={updateSkill}
            onRemoveSkill={removeSkill}
          />
        );
      case 'summary':
        return <SummaryForm data={resumeData.summary} onChange={updateSummary} />;
      case 'finalize':
        return <FinalizeForm data={resumeData} score={score} />;
      default:
        return null;
    }
  };

  const getNextStepTitle = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= steps.length) return null;
    
    const stepTitles: Record<ResumeStep, string> = {
      contacts: 'Contacts',
      experience: 'Experience', 
      education: 'Education',
      skills: 'Skills',
      summary: 'Summary',
      finalize: 'Finalize'
    };
    
    return stepTitles[steps[nextIndex]];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Stepper */}
      <ResumeStepper 
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        getStepCompletionStatus={getStepCompletionStatus}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-medium border border-border">
              {renderStepForm()}
              
              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStepIndex === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>

                <Button
                  onClick={goToNextStep}
                  disabled={currentStepIndex === steps.length - 1}
                  className="flex items-center space-x-2"
                >
                  <span>Next: {getNextStepTitle()}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Panel - Preview & Score */}
          <div className="space-y-6">
            <ResumeScore score={score} />
            <div className="sticky top-6">
              <ResumePreview data={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
