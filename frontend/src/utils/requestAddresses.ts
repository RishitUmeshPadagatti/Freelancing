export const base_url = "http://localhost:3000"

export const sign_up_client = `${base_url}/api/client/signup` // POST
export const sign_in_client = `${base_url}/api/client/signin` // POST
export const generate_description_ai = `${base_url}/api/client/generate-description-ai` // POST
export const create_job = `${base_url}/api/client/create-job` // POST

export const sign_up_freelancer = `${base_url}/api/freelancer/signup` // POST
export const sign_in_freelancer = `${base_url}/api/freelancer/signin` // POST
export const get_skills_freelancer = `${base_url}/api/freelancer/getSkills` // GET
export const details_about_you_freelancer = `${base_url}/api/freelancer/me` // GET
export const generate_bio_ai = `${base_url}/api/freelancer/generate-bio-ai` // POST
export const add_bio_and_skills = `${base_url}/api/freelancer/add-bio-and-skills` // PUT
export const add_resume = `${base_url}/api/freelancer/add-resume` // PUT

export const upload_profile_pic_url = `${base_url}/api/upload/image` // POST
export const upload_pdf_url = `${base_url}/api/upload/pdf` // POST
export const add_profile_pic = `${base_url}/api/common/add-profile-picture` // PUT

export const get_conversion_rates = `${base_url}/api/common/conversion-rates` // POST