// src/components/SimpleWizardFormDemo.tsx
import type React from "react";
import { useState, useMemo } from "react";
import { createSchema, createWizard } from "forgeform"; // Adjust import path as necessary

// 1. Define data type for the 4-step simple wizard
interface SimpleWizardData {
    fullName?: string;
    email?: string;
    serviceType?: 'web' | 'mobile' | 'design';
    budget?: number;
    message?: string; // Kept message in last step
}

// 2. Define schemas for each of the 4 steps
const step1Schema = createSchema<SimpleWizardData>({
    fields: {
        fullName: {
            type: "string", required: true, minLength: 2, maxLength: 100, trim: true,
            requiredErrorMessage: "Full Name is required",
            minLengthErrorMessage: "Name should be at least 2 characters",
            maxLengthErrorMessage: "Name is too long"
        },
    },
});

const step2Schema = createSchema<SimpleWizardData>({
    fields: {
        email: {
            type: "email", required: true, trim: true, lowercase: true,
            requiredErrorMessage: "Email is required",
            formatErrorMessage: "Invalid email format"
        },
    },
});

const step3Schema = createSchema<SimpleWizardData>({
    fields: {
        serviceType: {
            type: "enum", enum: ['web', 'mobile', 'design'], required: true,
            requiredErrorMessage: "Please select a service type"
        },
        budget: {
            type: "number", required: true, min: 500,
            requiredErrorMessage: "Budget is required",
            minErrorMessage: "Minimum budget is $500"
        },
    },
});

const step4Schema = createSchema<SimpleWizardData>({
    fields: {
        message: {
            type: "textarea", required: true, minLength: 10, maxLength: 500,
            requiredErrorMessage: "Message is required",
            minLengthErrorMessage: "Message should be at least 10 characters",
            maxLengthErrorMessage: "Message is too long (max 500 chars)"
        },
    },
});

// 3. Simple 4-Step WizardFormDemo Component
const SimpleWizardFormDemo: React.FC = () => {
    // Track current step index in React state
    const [currentStepIndexState, setCurrentStepIndexState] = useState<number>(0);
    // Local state for form data
    const [formData, setFormData] = useState<SimpleWizardData>({});

    // Create wizard instance using useMemo for efficiency
    const wizard = useMemo(() =>
        createWizard<SimpleWizardData>(
            [
                { id: "step-name", schema: step1Schema },
                { id: "step-email", schema: step2Schema },
                { id: "step-service", schema: step3Schema },
                { id: "step-message", schema: step4Schema },
            ],
            {}, // Initial data
            {
                onStepChange: (_, index) => setCurrentStepIndexState(index), // Update step index state
                onComplete: (finalData) => console.log("Simple Wizard Completed:", finalData), // Log final data
            }
        ), []
    );

    // Generic input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // Next step handler
    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await wizard.nextStep(formData);
        if (!success) {
            alert("Validation errors. Please check the form.");
        } else {
            setFormData({}); // Clear form data after step - clear only if success for better UX
        }
    };

    // Previous step handler
    const handlePrevious = (e: React.FormEvent) => {
        e.preventDefault();
        wizard.previousStep();
    };

    // Submit handler for final step
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await wizard.nextStep(formData);
        if (success) {
            alert("Simple Wizard Completed! Check console for data.");
            setFormData({});
            wizard.reset();
            setCurrentStepIndexState(0); // Reset to first step
        } else {
            alert("Validation errors on final step.");
        }
    };

    const progressPercentage = ((currentStepIndexState + 1) / 4) * 100; // For 4 steps

    const neumorphicBase = {
        borderRadius: '12px',
        backgroundColor: '#f0f0f0',
        boxShadow: '7px 7px 15px #d0d0d0, -7px -7px 15px #ffffff',
    };

    const neumorphicInset = {
        borderRadius: '12px',
        backgroundColor: '#f0f0f0',
        boxShadow: 'inset 7px 7px 15px #d0d0d0, inset -7px -7px 15px #ffffff',
    };


    return (
        <div style={{
            padding: '30px',
            fontFamily: 'Segoe UI, sans-serif',
            backgroundColor: '#f0f0f0', /* Light background for neumorphism */
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Neumorphic 4-Step Wizard</h3>

            {/* Progress Bar */}
            <div style={{
                ...neumorphicInset,
                width: '80%',
                height: '15px',
                margin: '20px 0',
                overflow: 'hidden', /* Clip rounded corners for inner bar */
            }}>
                <div style={{
                    height: '100%',
                    width: `${progressPercentage}%`,
                    backgroundColor: '#007bff',
                    borderRadius: '8px', /* Match parent's border-radius, or less for inner */
                    transition: 'width 0.4s ease-in-out',
                }} />
            </div>
            <p style={{ marginBottom: '20px', color: '#555' }}>Step {currentStepIndexState + 1} of 4</p>


            <form onSubmit={currentStepIndexState === 3 ? handleSubmit : handleNext} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxWidth: '500px',
                width: '95%',
                padding: '30px',
                ...neumorphicBase, /* Apply neumorphic container style */
            }}>

                {currentStepIndexState === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label htmlFor="fullName" style={{ color: '#333', fontWeight: 'bold' }}>Full Name:</label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} style={{ padding: '12px', ...neumorphicInset, border: 'none', width: '100%', }} />
                    </div>
                )}

                {currentStepIndexState === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label htmlFor="email" style={{ color: '#333', fontWeight: 'bold' }}>Email:</label>
                        <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleInputChange} style={{ padding: '12px', ...neumorphicInset, border: 'none', width: '100%', }} />
                    </div>
                )}

                {currentStepIndexState === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label htmlFor="serviceType" style={{ color: '#333', fontWeight: 'bold' }}>Service Type:</label>
                        <select id="serviceType" name="serviceType" value={formData.serviceType || ''} onChange={handleInputChange} style={{ padding: '12px', ...neumorphicInset, border: 'none', width: '100%', appearance: 'none', /* Remove default arrow in some browsers */ }}>
                            <option value="">Select Service</option>
                            <option value="web">Web Development</option>
                            <option value="mobile">Mobile Development</option>
                            <option value="design">UI/UX Design</option>
                        </select>
                        <label htmlFor="budget" style={{ color: '#333', fontWeight: 'bold', marginTop: '15px' }}>Budget (USD, min $500):</label>
                        <input type="number" id="budget" name="budget" value={formData.budget || ''} onChange={handleInputChange} style={{ padding: '12px', ...neumorphicInset, border: 'none', width: '100%', }} placeholder="Enter amount" />
                    </div>
                )}

                {currentStepIndexState === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label htmlFor="message" style={{ color: '#333', fontWeight: 'bold' }}>Message:</label>
                        <textarea id="message" name="message" value={formData.message || ''} onChange={handleInputChange} style={{ padding: '12px', ...neumorphicInset, border: 'none', width: '100%', minHeight: '120px', resize: 'vertical' }} placeholder="Your message here..." />
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
                    {currentStepIndexState > 0 && (
                        <button type="button" onClick={handlePrevious} style={{ padding: '12px 25px', ...neumorphicBase, border: 'none', cursor: 'pointer', color: '#555', fontWeight: 'bold' }}>Previous</button>
                    )}
                    <button type="submit" style={{
                        padding: '12px 25px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '7px 7px 15px #005cb3, -7px -7px 15px #0097ff', /* More intense shadow for button */
                    }}>
                        {currentStepIndexState === 3 ? 'Submit' : 'Next'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SimpleWizardFormDemo;