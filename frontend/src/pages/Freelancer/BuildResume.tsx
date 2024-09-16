import React, { useEffect, useState } from 'react'
import { ErrorToast, ToastContainerWrap } from '../../utils/toastify'
import UnauthorizedNavbar from '../../components/SignUpAndSignIn/UnauthorizedNavbar'
import { saveAs } from 'file-saver';
import axios from 'axios';
import { add_resume, details_about_you_freelancer, upload_pdf_url } from '../../utils/requestAddresses';
import { skillInterface } from '../../utils/interfaces';
import { useServerSkill } from '../../hooks/useServerSkill';
import { generatePDF } from '../../utils/ResumeGenerate';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { whereToNavigateTo } from '../../utils/functions';
import { talentAddResume } from '../../utils/frontendRoutes';

interface Education {
    institution: string;
    degree: string;
    year: string;
}

interface Experience {
    company: string;
    role: string;
    period: string;
    description: string;
}

interface Course {
    title: string;
    institution: string;
}

interface Certification {
    name: string;
    provider: string;
    date: string;
}

interface Project {
    name: string;
    description: string;
    link?: string;
}

interface ResumeFormData {
    name: string;
    email: string;
    phone: string;
    education: Education[];
    experience: Experience[];
    skills: string[];
    courses: Course[];
    certifications: Certification[];
    projects: Project[];
}

interface FreelancerSkill {
    skillId: number; // assuming skillId is a number
}

interface Skill {
    id: number;
    name: string;
}

const FreelancerBuildResume = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [data, setData] = useState<ResumeFormData>({
        name: '',
        email: '',
        phone: '',
        education: [],
        experience: [],
        skills: [],
        courses: [],
        certifications: [],
        projects: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof ResumeFormData) => {
        setData({ ...data, [key]: e.target.value });
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, key: keyof Education | keyof Experience | keyof Course | keyof Certification | keyof Project, section: keyof ResumeFormData) => {
        const updatedSection = [...data[section] as any];
        updatedSection[index] = { ...updatedSection[index], [key]: e.target.value };
        setData({ ...data, [section]: updatedSection });
    };

    const handleAddSection = (section: keyof ResumeFormData) => {
        if (section === 'education') setData({ ...data, education: [...data.education, { institution: '', degree: '', year: '' }] });
        if (section === 'experience') setData({ ...data, experience: [...data.experience, { company: '', role: '', period: '', description: '' }] });
        if (section === 'courses') setData({ ...data, courses: [...data.courses, { title: '', institution: '' }] });
        if (section === 'certifications') setData({ ...data, certifications: [...data.certifications, { name: '', provider: '', date: '' }] });
        if (section === 'projects') setData({ ...data, projects: [...data.projects, { name: '', description: '', link: '' }] });
    };

    const handleChangeSkills = (e: React.ChangeEvent<HTMLInputElement>) => {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim()); // Split by commas and trim extra spaces
        setData({ ...data, skills: skillsArray });
    };

    const predefinedSkills: skillInterface[] = useServerSkill()
    useEffect(() => {
        try {
            axios.get(details_about_you_freelancer, { withCredentials: true })
                .then(result => {
                    const freelancer = result.data.freelancer;

                    const skillNames = freelancer.skills.map((skillObj1: FreelancerSkill) => {
                        const matchedSkill = predefinedSkills.find((skillObj2: Skill) => skillObj2.id === skillObj1.skillId);
                        return matchedSkill ? matchedSkill.name : null;
                    }).filter(Boolean);

                    setData({
                        ...data,
                        name: freelancer.fullName,
                        email: freelancer.email,
                        skills: skillNames
                    });
                })
        } catch (error) {
            console.log(error);
        }
    }, [predefinedSkills])

    const handleDownload = async () => {
        const pdfBytes = await generatePDF(
            data.name,
            `${data.email} | ${data.phone}`,
            data.education,
            data.experience,
            data.skills,
            data.courses,
            data.certifications,
            data.projects
        )
        saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `${data.name}_Resume.pdf`);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const pdfBytes = await generatePDF(
                data.name,
                `${data.email} | ${data.phone}`,
                data.education,
                data.experience,
                data.skills,
                data.courses,
                data.certifications,
                data.projects
            )

            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })

            const formData = new FormData();
            formData.append('resume', pdfBlob, 'resume.pdf');

            const response = await axios.post(upload_pdf_url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const url = response.data.url

            const result = await axios.put(add_resume, {
                url: url
            }, {withCredentials: true})

            navigate(whereToNavigateTo(result.data.freelancer))

        } catch (error) {
            console.error('Error uploading PDF:', error);
            ErrorToast("Error uploading PDF")
        }
    };

    return (<>
        <ToastContainerWrap />
        <UnauthorizedNavbar />
        <form className=" min-h-[93vh] bg-defaultGray p-6 space-y-6 " onSubmit={handleSubmit}>
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-center cursor-default">{t("resume-information")}</h2>
                <div className="form-control">
                    <label className="label" htmlFor='name'>
                        <span className="text-xl font-semibold cursor-default">{t("name")}</span>
                    </label>
                    <input
                        type="text"
                        id='name'
                        className="input input-bordered"
                        value={data.name}
                        onChange={(e) => handleChange(e, 'name')}
                    />
                </div>
                <div className="form-control">
                    <label className="label" htmlFor='email'>
                        <span className="text-xl font-semibold cursor-default">{t("email")}</span>
                    </label>
                    <input
                        type="email"
                        id='email'
                        className="input input-bordered"
                        value={data.email}
                        onChange={(e) => handleChange(e, 'email')}
                    />
                </div>
                <div className="form-control">
                    <label className="label" htmlFor='phone'>
                        <span className="text-xl font-semibold cursor-defaultt">{t("phone")}</span>
                    </label>
                    <input
                        type="text"
                        id='phone'
                        className="input input-bordered"
                        value={data.phone}
                        onChange={(e) => handleChange(e, 'phone')}
                    />
                </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold cursor-default">{t("education")}</h3>
                {data.education.map((edu, index) => (
                    <div key={index} className="space-y-2">
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("institution")}
                            value={edu.institution}
                            onChange={(e) => handleArrayChange(e, index, 'institution', 'education')}
                        />
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("degree")}
                            value={edu.degree}
                            onChange={(e) => handleArrayChange(e, index, 'degree', 'education')}
                        />
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("year")}
                            value={edu.year}
                            onChange={(e) => handleArrayChange(e, index, 'year', 'education')}
                        />
                    </div>
                ))}
                <button
                    type="button"
                    className="btn border-gray-300"
                    onClick={() => handleAddSection('education')}>
                    {t("add-education")}
                </button>
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold cursor-default">{t("experience")}</h3>
                {data.experience.map((exp, index) => (
                    <div key={index} className="space-y-2">
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("company")}
                            value={exp.company}
                            onChange={(e) => handleArrayChange(e, index, 'company', 'experience')}
                        />
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("role")}
                            value={exp.role}
                            onChange={(e) => handleArrayChange(e, index, 'role', 'experience')}
                        />
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("period")}
                            value={exp.period}
                            onChange={(e) => handleArrayChange(e, index, 'period', 'experience')}
                        />
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder={t("description")}
                            value={exp.description}
                            onChange={(e) => handleArrayChange(e, index, 'description', 'experience')}
                        />
                    </div>
                ))}
                <button
                    type="button"
                    className="btn border-gray-300"
                    onClick={() => handleAddSection('experience')}>
                    {t("add-experience")}
                </button>
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
                <label htmlFor='skills' className="text-xl font-semibold cursor-default">Skills</label>
                <input
                    type="text"
                    id='skills'
                    className="input input-bordered w-full"
                    placeholder={t("add-skills-comma-separated")}
                    value={data.skills.join(', ')}
                    onChange={(e) => handleChangeSkills(e)}
                />
            </div>

            {/* Courses Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold cursor-default">{t("courses")}</h3>
                {data.courses.map((course, index) => (
                    <div key={index} className="space-y-2">
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("title")}
                            value={course.title}
                            onChange={(e) => handleArrayChange(e, index, 'title', 'courses')}
                        />
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("institution")}
                            value={course.institution}
                            onChange={(e) => handleArrayChange(e, index, 'institution', 'courses')}
                        />
                    </div>
                ))}
                <button
                    type="button"
                    className="btn border-gray-300"
                    onClick={() => handleAddSection('courses')}>
                    {t("add-course")}
                </button>
            </div>

            {/* Certifications Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold cursor-default">{t("certifications")}</h3>
                {data.certifications.map((cert, index) => (
                    <div key={index} className="space-y-2">
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("certification-name")}
                            value={cert.name}
                            onChange={(e) => handleArrayChange(e, index, 'name', 'certifications')}
                        />
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("provider")}
                            value={cert.provider}
                            onChange={(e) => handleArrayChange(e, index, 'provider', 'certifications')}
                        />
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("date")}
                            value={cert.date}
                            onChange={(e) => handleArrayChange(e, index, 'date', 'certifications')}
                        />
                    </div>
                ))}
                <button
                    type="button"
                    className="btn border-gray-300"
                    onClick={() => handleAddSection('certifications')}>
                    {t("add-certification")}
                </button>
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold cursor-default">{t("projects")}</h3>
                {data.projects.map((proj, index) => (
                    <div key={index} className="space-y-2">
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("project-name")}
                            value={proj.name}
                            onChange={(e) => handleArrayChange(e, index, 'name', 'projects')}
                        />
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder={t("description")}
                            value={proj.description}
                            onChange={(e) => handleArrayChange(e, index, 'description', 'projects')}
                        />
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder={t("link")}
                            value={proj.link || ''}
                            onChange={(e) => handleArrayChange(e, index, 'link', 'projects')}
                        />
                    </div>
                ))}
                <button
                    type="button"
                    className="btn border-gray-300"
                    onClick={() => handleAddSection('projects')}>
                    {t("add-project")}
                </button>
            </div>

            <div className='text-[11px] mt-3 cursor-pointer hover:underline text-center'
                onClick={() => navigate(talentAddResume)}>
                {t("already-have-a-resume?")}
            </div>

            <div
                className="w-full border border-gray-300 btn"
                onClick={handleDownload}>
                {t("download-resume")}
            </div>

            <button
                type="submit"
                onClick={handleSubmit}
                className="btn w-full bg-purple-600 hover:bg-purple-700 text-white">
                {t("save-resume")}
            </button>
        </form>
    </>
    );
}

export default FreelancerBuildResume
