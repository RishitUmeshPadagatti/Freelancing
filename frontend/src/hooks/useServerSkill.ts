import axios from "axios"
import { useEffect, useState } from "react"
import { get_skills_freelancer } from "../utils/requestAddresses"

export function useServerSkill() {
    const [skills, setSkills] = useState([])

    useEffect(() => {
        axios.get(get_skills_freelancer, { withCredentials: true })
            .then(res => {
                setSkills(res.data.skills)
            })
    }, [])

    return skills
}