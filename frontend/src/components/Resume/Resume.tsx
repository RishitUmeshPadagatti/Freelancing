import React from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import axios from 'axios';

interface ResumeProps {
  data: {
    name: string;
    contact: string;
    education: Array<{ institution: string; degree: string; year: string }>;
    experience: Array<{ company: string; role: string; period: string; description: string }>;
    skills: string[];
    courses: Array<{ title: string; institution: string }>;
    certifications: Array<{ name: string; provider: string; date: string }>;
    projects: Array<{ name: string; description: string; link?: string }>;
  };
}

const Resume: React.FC<ResumeProps> = ({ data }) => {
  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 850]);
    const { name, contact, education, experience, skills, courses, certifications, projects } = data;

    // Load custom fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 12;
    let y = 800;

    // Draw Background Color (optional)
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 600,
      height: 850,
      color: rgb(0.95, 0.95, 0.95),
    });

    // Name and Contact with Title Font
    page.drawText(name, { x: 50, y, size: 20, font: titleFont, color: rgb(0, 0, 0.5) });
    y -= 30;
    page.drawText(contact, { x: 50, y, size: fontSize, font });

    y -= 40; // Margin between sections

    // Section Header Styling
    const drawSectionTitle = (title: string) => {
      page.drawText(title, { x: 50, y, size: 16, font: titleFont, color: rgb(0.1, 0.3, 0.6) });
      y -= 20;
    };

    // Education Section
    drawSectionTitle('Education');
    education.forEach((edu) => {
      page.drawText(`${edu.degree} - ${edu.institution} (${edu.year})`, { x: 50, y, size: fontSize, font });
      y -= 15;
    });

    y -= 20; // Extra margin

    // Experience Section
    drawSectionTitle('Experience');
    experience.forEach((exp) => {
      page.drawText(`${exp.role} at ${exp.company} (${exp.period})`, { x: 50, y, size: fontSize, font });
      y -= 12;
      page.drawText(exp.description, { x: 50, y, size: fontSize - 2, font, color: rgb(0.4, 0.4, 0.4) });
      y -= 25;
    });

    y -= 20; // Extra margin

    // Skills Section
    drawSectionTitle('Skills');
    page.drawText(skills.join(', '), { x: 50, y, size: fontSize, font });

    y -= 20; // Extra margin

    // Courses Section
    if (courses.length > 0) {
      drawSectionTitle('Courses');
      courses.forEach((course) => {
        page.drawText(`${course.title} - ${course.institution}`, { x: 50, y, size: fontSize, font });
        y -= 15;
      });
      y -= 20; // Extra margin
    }

    // Certifications Section
    if (certifications.length > 0) {
      drawSectionTitle('Certifications');
      certifications.forEach((cert) => {
        page.drawText(`${cert.name} by ${cert.provider} (${cert.date})`, { x: 50, y, size: fontSize, font });
        y -= 15;
      });
      y -= 20; // Extra margin
    }

    // Projects Section
    if (projects.length > 0) {
      drawSectionTitle('Projects');
      projects.forEach((project) => {
        page.drawText(project.name, { x: 50, y, size: fontSize, font });
        y -= 12;
        page.drawText(project.description, { x: 50, y, size: fontSize - 2, font, color: rgb(0.4, 0.4, 0.4) });
        if (project.link) {
          y -= 12;
          page.drawText(`Link: ${project.link}`, { x: 50, y, size: fontSize - 2, font, color: rgb(0, 0, 1) });
        }
        y -= 25;
      });
    }

    // Save PDF as bytes
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  };

  const handleDownload = async () => {
    const pdfBytes = await generatePDF();
    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `${data.name}_Resume.pdf`);
  };

  const handleUpload = async () => {
    const pdfBytes = await generatePDF();
    const formData = new FormData();
    formData.append('file', new Blob([pdfBytes], { type: 'application/pdf' }), `${data.name}_Resume.pdf`);

    axios.post('https://your-server-endpoint.com/upload', formData)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="flex flex-col items-center mt-10 space-y-4">
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={handleDownload}>
        Download Resume as PDF
      </button>
      <button
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        onClick={handleUpload}>
        Upload Resume to Server
      </button>
    </div>
  );
};

export default Resume;
