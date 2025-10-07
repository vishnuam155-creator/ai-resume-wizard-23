import { ResumeData } from '@/types/resume';

interface CompactResumeTemplateProps {
  data: ResumeData;
}

export const CompactResumeTemplate = ({ data }: CompactResumeTemplateProps) => {
  const formatDescription = (description: string) => {
    if (!description) return '';
    
    const lines = description.split('\n');
    let html = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('- ') || line.startsWith('• ')) {
        const content = line.substring(2).trim();
        html += `– ${content}<br/>`;
      } else if (line) {
        html += line + '<br/>';
      }
    }
    
    return html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [year, month] = dateStr.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-[11in] w-[8.5in] mx-auto p-8 font-sans text-[11pt] leading-tight">
      {/* Header - Name and contact in compact single-line format */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          {data.contacts.firstName} {data.contacts.lastName}
        </h1>
        <div className="text-[10pt] text-gray-700 text-center">
          {[
            data.contacts.email,
            data.contacts.phone,
            data.contacts.website,
            data.contacts.linkedin && 'LinkedIn',
            data.contacts.github && 'GitHub',
            data.contacts.location
          ].filter(Boolean).join(' ∣ ')}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900">Summary</h2>
          <p className="text-[10pt] leading-relaxed text-gray-800">{data.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3 border-b border-gray-900">Work Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-gray-900">{exp.jobTitle}</div>
                  <div className="text-[10pt] text-gray-600 whitespace-nowrap ml-4">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'present' : formatDate(exp.endDate)}
                  </div>
                </div>
                <div className="text-[10pt] italic text-gray-700 mb-1">{exp.company}</div>
                {exp.description && (
                  <div 
                    className="text-[10pt] text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatDescription(exp.description) }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3 border-b border-gray-900">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-gray-900">{project.name}</div>
                  {project.url && (
                    <div className="text-[10pt] text-blue-600 whitespace-nowrap ml-4">Link to Demo</div>
                  )}
                </div>
                {project.description && (
                  <div 
                    className="text-[10pt] text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatDescription(project.description) }}
                  />
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="text-[9pt] text-gray-600 mt-1">
                    {project.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3 border-b border-gray-900">Education</h2>
          <table className="w-full text-[10pt]">
            <tbody>
              {data.education.map((edu) => (
                <tr key={edu.id} className="border-b border-gray-200">
                  <td className="py-2 text-gray-700 whitespace-nowrap pr-4">
                    {formatDate(edu.startDate)} - {edu.isCurrentlyStudying ? 'present' : formatDate(edu.endDate)}
                  </td>
                  <td className="py-2 text-gray-800">
                    <div className="font-medium">{edu.degree} at {edu.institution}</div>
                    {edu.fieldOfStudy && <div className="text-gray-600">{edu.fieldOfStudy}</div>}
                  </td>
                  <td className="py-2 text-gray-700 text-right">
                    {edu.gpa && `(GPA: ${edu.gpa})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Certificates */}
      {data.certificates.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3 border-b border-gray-900">Certifications</h2>
          <div className="space-y-2 text-[10pt]">
            {data.certificates.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <div className="text-gray-800">
                  <span className="font-medium">{cert.name}</span> - {cert.issuer}
                </div>
                <div className="text-gray-600 whitespace-nowrap ml-4">
                  {formatDate(cert.issueDate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold mb-3 border-b border-gray-900">Skills</h2>
          <table className="w-full text-[10pt]">
            <tbody>
              {Array.from(new Set(data.skills.map(skill => skill.category))).map(category => (
                <tr key={category} className="border-b border-gray-200">
                  <td className="py-2 font-medium text-gray-800 w-1/4">{category}</td>
                  <td className="py-2 text-gray-700">
                    {data.skills
                      .filter(skill => skill.category === category)
                      .map(skill => skill.name)
                      .join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-[9pt] text-gray-500 text-center">
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
};