import { Dispatch, memo, SetStateAction, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import BrushAI from "../../assets/brush_ai.svg";
// import MicAI from "../../assets/mic_ai.svg";
import axios from "axios";
import { ErrorToast } from "../../utils/toastify";
import { useRecoilValue } from "recoil";
import { languageAtom } from "../../recoil/atoms";

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface BioSectionProps {
    bio: string;
    setBio: Dispatch<SetStateAction<string>>;
    backendAddress: string;
    titleText: string;
    placeholder: string;
}

export const BioSection = memo(({ bio, setBio, backendAddress, titleText, placeholder }: BioSectionProps) => {
    const { t } = useTranslation();
    const [isAIGenerated, setIsAIGenerated] = useState(false);
    const lan = useRecoilValue(languageAtom)

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false)
    const [isListening, setIsListening] = useState(false)

    const recognitionRef = useRef<any>(null); // Store recognition instance here

    const simulateTypingInTextarea = async (text: string) => {
        setBio("");
        const time = text.length > 1500 ? 25 : 40;
        const words = text.split(" ")
        for (let i = 0; i < words.length; i++) {
            setBio((prev) => prev + words[i] + " ");
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(1);
                }, time);
            });
        }
        setIsLoading(false);
        setIsLoading2(false);
    };

    const generateBioUsingAI = async () => {
        try {
            setIsLoading(true);
            setIsAIGenerated(true);
            const result = await axios.post(
                backendAddress,
                { prompt: bio },
                { withCredentials: true }
            );

            const aiResponse = result.data.response;
            simulateTypingInTextarea(aiResponse);
        } catch (error) {
            console.log(error);
            ErrorToast("Something went wrong");
        }
    };

    const generateBioUsingVoiceAI = async () => {
        try {
            setIsLoading2(true);
            setIsAIGenerated(true);
            const result = await axios.post(
                backendAddress,
                { prompt: bio },
                { withCredentials: true }
            );

            const aiResponse = result.data.response;
            simulateTypingInTextarea(aiResponse);
        } catch (error) {
            console.log(error);
            ErrorToast("Something went wrong");
        }
    }

    const voiceRecognition = () => {
        if (!recognitionRef.current) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript + " ";
                    }
                }
                // Append the transcript directly to the bio state
                setBio((prevBio) => prevBio + finalTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                ErrorToast("Something went wrong with voice recognition");
                setIsListening(false)
            };
        }

        if (isListening === false) {
            recognitionRef.current.start();
            setIsListening(true)
        } else {
            recognitionRef.current.stop();
            setIsListening(false)
            generateBioUsingVoiceAI()
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row justify-between">
                <label htmlFor="textareaBio" className="font-bold sm:text-3xl text-xl">
                    {titleText}
                </label>
                <div className="flex gap-2 flex-col sm:flex-row">
                    {lan === "en" &&
                        <button
                            className={`btn border border-gray-300 ${isLoading2 ? "border-purple-600 " : ""}`}
                            onClick={() => {
                                if(!isLoading && !isLoading2) voiceRecognition()
                            }}>
                            {/* <img src={MicAI} className="w-5" /> */}
                            <MicAI />
                            {isLoading2 ? "AI Voice Generating..." : (isListening ? "Stop Listening" : "AI Voice Generate")}
                        </button>
                    }

                    <button
                        className="btn bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={bio.length <= 20}
                        onClick={() => {
                            if (!isLoading && !isLoading2) generateBioUsingAI()
                        }}>
                        <img src={BrushAI} className="w-5" />
                        {!isLoading
                            ? t("ai-text-generate")
                            : t("ai-text-generating")}
                    </button>
                </div>
            </div>

            <div className="py-2">
                {/* Bio Input */}
                <textarea
                    placeholder={placeholder}
                    className={`textarea textarea-bordered ${isAIGenerated ? "textarea-primary" : ""
                        } w-full h-[50vh] p-4 font-serif text-base resize-none overflow-y-auto overflow-x-hidden`}
                    id="textareaBio"
                    value={bio}
                    onChange={(e) => {
                        setBio(e.target.value);
                        if (bio === "") setIsAIGenerated(false);
                    }}
                />
            </div>
        </div>
    );
});


const MicAI = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#000000"
            >
            <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" />
        </svg>
    );
};