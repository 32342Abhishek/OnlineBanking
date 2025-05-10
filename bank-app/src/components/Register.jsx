import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import axiosInstance from "../utils/axiosInstance";
import { API_CONFIG, APP_CONFIG } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { logApiResponse, logApiError, extractAuthData, createUserObject } from '../utils/apiUtils';
import registerDiagnostic from '../utils/registerDiagnostic';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        // Optional fields
        address: '',
        dateOfBirth: '',
        idProofType: '',
        idProofNumber: '',
        role: 'CUSTOMER' // Default role
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showDiagnostics, setShowDiagnostics] = useState(false);
    const [diagnosticResults, setDiagnosticResults] = useState(null);
    
    // ID proof type options
    const idProofTypes = [
        { value: '', label: 'Select ID Type' },
        { value: 'AADHAAR', label: 'Aadhaar Card' },
        { value: 'PAN', label: 'PAN Card' },
        { value: 'PASSPORT', label: 'Passport' },
        { value: 'DRIVING_LICENSE', label: 'Driving License' },
        { value: 'VOTER_ID', label: 'Voter ID' }
    ];
    
    // Role options
    const roleOptions = [
        { value: 'CUSTOMER', label: 'Customer' },
        { value: 'ADMIN', label: 'Administrator' }
    ];
    
    // Clear errors when form data changes
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setErrors({});
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.address || !formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms and conditions';
        }

        // Optional field validations
        if (formData.dateOfBirth) {
            try {
                const date = new Date(formData.dateOfBirth);
                if (isNaN(date.getTime()) || date > new Date()) {
                    newErrors.dateOfBirth = 'Please enter a valid date of birth';
                }
            } catch (e) {
                newErrors.dateOfBirth = 'Please enter a valid date of birth';
            }
        }
        
        if (formData.idProofType && !formData.idProofNumber) {
            newErrors.idProofNumber = 'ID proof number is required if type is selected';
        }
        
        if (!formData.idProofType && formData.idProofNumber) {
            newErrors.idProofType = 'ID proof type is required if number is provided';
        }

        return newErrors;
    };

    const formatDateOfBirth = (dateString) => {
        if (!dateString) return null;
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null;
            
            // Format as YYYY-MM-DDThh:mm:ss for backend's LocalDateTime
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            // Add time component (00:00:00) for LocalDateTime in Spring Boot
            return `${year}-${month}-${day}T00:00:00`;
        } catch (e) {
            console.error('Error formatting date:', e);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        setIsLoading(true);
        setGeneralError('');
        
        try {
            // Create registration data object for API
            const registrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                address: formData.address || '',
                role: formData.role
            };
            
            // Add optional fields if they exist
            if (formData.dateOfBirth) {
                registrationData.dateOfBirth = formatDateOfBirth(formData.dateOfBirth);
            }
            
            if (formData.idProofType) {
                registrationData.idProofType = formData.idProofType;
            }
            
            if (formData.idProofNumber) {
                registrationData.idProofNumber = formData.idProofNumber;
            }
            
            console.log('Sending registration data:', registrationData);
            
            // Call the backend API to register
            const response = await axiosInstance.post(
                API_CONFIG.AUTH.REGISTER, 
                registrationData
            );
            
            logApiResponse('Registration', response);
            
            // The Spring backend uses ApiResponse wrapper
            if (response.data && response.data.success) {
                const authData = response.data.data;
                
                // Check if MFA is required
                if (authData && authData.mfaRequired) {
                    setShowOtpInput(true);
                    setSuccessMessage(response.data.message || "OTP has been sent to your email/phone. Please verify to complete registration.");
                } else {
                    // Direct registration successful (unlikely in our flow)
                    handleSuccessfulRegistration(authData);
                }
            } else {
                setGeneralError(response.data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            logApiError('Registration', err);
            
            if (err.response) {
                if (err.response.status === 403) {
                    setGeneralError("Access forbidden. Please check your credentials or contact support.");
                } else if (err.response.status === 400) {
                    if (err.response.data && err.response.data.message) {
                        setGeneralError(err.response.data.message);
                    } else {
                        setGeneralError("Invalid registration data. Please check your information.");
                    }
                } else {
                    setGeneralError(err.response.data?.message || "Registration failed. Please try again.");
                }
            } else {
                // Fallback to demo mode if API is not reachable
                console.log("API not reachable, using demo mode for registration");
                setShowOtpInput(true);
                setSuccessMessage("Demo mode: OTP has been sent to your email/phone. Please verify to complete registration.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneralError('');
        
        try {
            // Verify OTP with the backend - send only email and otp
            const response = await axiosInstance.post(
                API_CONFIG.AUTH.VERIFY_OTP, 
                {
                    email: formData.email,
                    otp: otp
                }
            );
            
            logApiResponse('Registration OTP verification', response);
            
            if (response.data && response.data.success) {
                const authData = response.data.data;
                
                // Handle successful registration
                handleSuccessfulRegistration(authData);
            } else {
                setGeneralError(response.data.message || "Verification failed. Please try again.");
            }
        } catch (err) {
            logApiError('Registration OTP verification', err);
            
            if (err.response) {
                if (err.response.status === 403) {
                    setGeneralError("Invalid OTP or verification failed. Please try again.");
                } else if (err.response.status === 400) {
                    setGeneralError("Invalid OTP format or expired OTP. Please try again or request a new OTP.");
                } else if (err.response.data && err.response.data.message) {
                    setGeneralError(err.response.data.message);
                } else {
                    setGeneralError("Verification failed. Please try again.");
                }
            } else {
                // Fallback to demo mode if API is not reachable
                console.log("API not reachable, using demo mode for OTP verification");
                
                // In demo mode, any 6-digit OTP will work
                if (otp.length === 6) {
                    // Mock successful registration
                    handleSuccessfulRegistration({
                        success: true,
                        message: "Registration completed successfully!"
                    });
                } else {
                    setGeneralError("Please enter a valid 6-digit OTP code.");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSuccessfulRegistration = (authData) => {
        if (!authData) {
            console.error("No auth data provided");
            setGeneralError("Invalid response from server. Please try again.");
            return;
        }
        
        // Always redirect to login page after successful registration
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
            navigate('/login?registration_success=true');
        }, 1500);
    };

    const resendOtp = async () => {
        setIsLoading(true);
        setGeneralError('');
        
        try {
            // Call the backend API to register again to resend OTP
            const registrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                address: formData.address || '',
                role: formData.role
            };
            
            // Add optional fields if they exist
            if (formData.dateOfBirth) {
                registrationData.dateOfBirth = formatDateOfBirth(formData.dateOfBirth);
            }
            
            if (formData.idProofType) {
                registrationData.idProofType = formData.idProofType;
            }
            
            if (formData.idProofNumber) {
                registrationData.idProofNumber = formData.idProofNumber;
            }
            
            const response = await axiosInstance.post(
                API_CONFIG.AUTH.REGISTER, 
                registrationData
            );
            
            logApiResponse('Resend Registration OTP', response);
            
            if (response.data && response.data.success) {
                setSuccessMessage(response.data.message || "New OTP has been sent to your email/phone.");
            } else {
                setGeneralError(response.data.message || "Failed to resend OTP. Please try again.");
            }
        } catch (err) {
            logApiError('Resend Registration OTP', err);
            
            if (err.response && err.response.data && err.response.data.message) {
                setGeneralError(err.response.data.message);
            } else {
                // Fallback to demo mode
                console.log("API not reachable, using demo mode for resend OTP");
                setSuccessMessage("Demo mode: New OTP has been sent to your email/phone.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const runDiagnostics = async () => {
        setIsLoading(true);
        setGeneralError('');
        try {
            const results = await registerDiagnostic.runFullDiagnostic();
            setDiagnosticResults(results);
            setShowDiagnostics(true);
            
            if (results.workingEndpoint) {
                setSuccessMessage(`Found working endpoint: ${results.workingEndpoint}`);
            } else {
                setGeneralError('No working endpoint found. Please check server status.');
            }
        } catch (err) {
            console.error('Error running diagnostics:', err);
            setGeneralError('Error running diagnostics: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Render OTP verification form
    if (showOtpInput) {
        return (
            <div className="register-container">
                <div className="register-background">
                    <div className="register-shape"></div>
                    <div className="register-shape"></div>
                </div>
                
                <div className="register-card otp-card">
                    <div className="register-header">
                        <h1 className="register-title">Verification Required</h1>
                        <p className="register-subtitle">Please enter the 6-digit OTP sent to your email/phone</p>
                    </div>
                    
                    {successMessage && (
                        <div className="success-message slide-in">
                            <i className="success-icon">✅</i> {successMessage}
                        </div>
                    )}
                    
                    {generalError && (
                        <div className="error-message slide-in">
                            <i className="error-icon">⚠️</i> {generalError}
                        </div>
                    )}
                    
                    <form className="otp-form" onSubmit={handleOtpSubmit}>
                        <div className="input-group otp-input-group">
                            <label htmlFor="otp">Enter OTP Code</label>
                            <div className="input-with-icon">
                                <i className="input-icon">🔐</i>
                                <input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                                    required
                                    maxLength="6"
                                    className="otp-input"
                                />
                            </div>
                            <div className="otp-description">
                                <p>The OTP will expire in 10 minutes</p>
                            </div>
                        </div>
                        
                        <div className="otp-actions">
                            <button type="submit" className="register-button otp-button" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="button-loader"></span>
                                ) : (
                                    'Verify & Complete'
                                )}
                            </button>
                            
                            <div className="form-footer otp-footer">
                                <p className="otp-footer-text">Didn't receive the OTP?</p>
                                <button 
                                    type="button" 
                                    className="resend-otp" 
                                    onClick={resendOtp}
                                    disabled={isLoading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                            
                            <div className="back-link-container">
                                <button 
                                    type="button" 
                                    className="back-to-register-button" 
                                    onClick={() => setShowOtpInput(false)}
                                    disabled={isLoading}
                                >
                                    <i className="back-icon">←</i> Back to Registration
                                </button>
                            </div>
                        </div>
                    </form>
                    
                    <div className="secure-verification-info">
                        <i className="secure-icon">🔒</i>
                        <p>Secure verification with end-to-end encryption</p>
                    </div>
                </div>
            </div>
        );
    }

    // Render registration form
    return (
        <div className="register-container">
            <div className="register-background">
                <div className="register-shape"></div>
                <div className="register-shape"></div>
            </div>
            
            <div className="register-card">
                <div className="register-header">
                    <h1 className="register-title">Create Account</h1>
                    <p className="register-subtitle">Join our banking services in just a few steps</p>
                    
                    {process.env.NODE_ENV === 'development' && (
                        <button 
                            onClick={runDiagnostics} 
                            className="diagnostic-btn"
                            style={{ fontSize: '0.8rem', padding: '5px 10px', marginTop: '10px' }}
                        >
                            Run API Diagnostics
                        </button>
                    )}
                </div>
                
                {/* Diagnostic Results */}
                {showDiagnostics && diagnosticResults && (
                    <div className="diagnostic-panel" style={{ 
                        margin: '1rem 0', 
                        padding: '1rem', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <h3>API Diagnostic Results</h3>
                        <p><strong>Base URL:</strong> {diagnosticResults.baseUrl}</p>
                        <p><strong>Full URL:</strong> {diagnosticResults.fullUrl}</p>
                        <p><strong>Server Status:</strong> {diagnosticResults.serverStatus}</p>
                        
                        <h4>Endpoint Tests</h4>
                        <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {diagnosticResults.endpointTests.endpoints.map((endpoint, index) => (
                                <div key={index} style={{ 
                                    padding: '8px', 
                                    margin: '5px 0', 
                                    backgroundColor: endpoint.success ? '#e6ffe6' : '#ffe6e6',
                                    borderRadius: '4px'
                                }}>
                                    <p><strong>URL:</strong> {endpoint.url}</p>
                                    <p><strong>Description:</strong> {endpoint.description}</p>
                                    <p><strong>Status:</strong> {endpoint.status || 'N/A'}</p>
                                    <p><strong>CORS:</strong> {endpoint.corsStatus || 'N/A'}</p>
                                    {endpoint.error && <p><strong>Error:</strong> {endpoint.error}</p>}
                                </div>
                            ))}
                        </div>
                        
                        <p><strong>Recommendation:</strong> {diagnosticResults.recommendation}</p>
                        
                        <button 
                            onClick={() => setShowDiagnostics(false)} 
                            style={{ 
                                padding: '5px 10px', 
                                marginTop: '10px', 
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        >
                            Hide Diagnostics
                        </button>
                    </div>
                )}
                
                {generalError && (
                    <div className="error-message slide-in">
                        <i className="error-icon">⚠️</i> {generalError}
                    </div>
                )}
                
                {successMessage && (
                    <div className="success-message slide-in">
                        <i className="success-icon">✅</i> {successMessage}
                    </div>
                )}
                
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="firstName">First Name</label>
                            <div className="input-with-icon">
                                <i className="input-icon">👤</i>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter your first name"
                                    className={errors.firstName ? 'error' : ''}
                                />
                            </div>
                            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <div className="input-with-icon">
                                <i className="input-icon">👤</i>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter your last name"
                                    className={errors.lastName ? 'error' : ''}
                                />
                            </div>
                            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-with-icon">
                            <i className="input-icon">✉️</i>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                className={errors.email ? 'error' : ''}
                            />
                        </div>
                        {errors.email && <div className="field-error">{errors.email}</div>}
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="input-with-icon">
                            <i className="input-icon">📱</i>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter your 10-digit phone number"
                                className={errors.phoneNumber ? 'error' : ''}
                            />
                        </div>
                        {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="address">Address</label>
                        <div className="input-with-icon">
                            <i className="input-icon">🏠</i>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                className={errors.address ? 'error' : ''}
                            />
                        </div>
                        {errors.address && <div className="field-error">{errors.address}</div>}
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <div className="input-with-icon">
                            <i className="input-icon">📅</i>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={errors.dateOfBirth ? 'error' : ''}
                                max={new Date().toISOString().split('T')[0]} // Set max date to today
                            />
                        </div>
                        {errors.dateOfBirth && <div className="field-error">{errors.dateOfBirth}</div>}
                    </div>
                    
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="idProofType">ID Proof Type</label>
                            <div className="input-with-icon">
                                <i className="input-icon">🪪</i>
                                <select
                                    id="idProofType"
                                    name="idProofType"
                                    value={formData.idProofType}
                                    onChange={handleChange}
                                    className={errors.idProofType ? 'error' : ''}
                                >
                                    {idProofTypes.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.idProofType && <div className="field-error">{errors.idProofType}</div>}
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="idProofNumber">ID Number</label>
                            <div className="input-with-icon">
                                <i className="input-icon">🔢</i>
                                <input
                                    type="text"
                                    id="idProofNumber"
                                    name="idProofNumber"
                                    value={formData.idProofNumber}
                                    onChange={handleChange}
                                    placeholder="Enter ID proof number"
                                    className={errors.idProofNumber ? 'error' : ''}
                                />
                            </div>
                            {errors.idProofNumber && <div className="field-error">{errors.idProofNumber}</div>}
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <i className="input-icon">🔒</i>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a secure password"
                                className={errors.password ? 'error' : ''}
                            />
                            <button 
                                type="button" 
                                className="password-toggle" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.password && <div className="field-error">{errors.password}</div>}
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-with-icon">
                            <i className="input-icon">🔒</i>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            <button 
                                type="button" 
                                className="password-toggle" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="role">Role</label>
                        <div className="input-with-icon">
                            <i className="input-icon">👥</i>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={errors.role ? 'error' : ''}
                            >
                                {roleOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.role && <div className="field-error">{errors.role}</div>}
                    </div>
                    
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                        />
                        <label htmlFor="agreeTerms">
                            I agree to the <a href="/terms" className="terms-link">Terms & Conditions</a> and <a href="/privacy" className="terms-link">Privacy Policy</a>
                        </label>
                    </div>
                    {errors.agreeTerms && <div className="field-error terms-error">{errors.agreeTerms}</div>}
                    
                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? (
                            <span className="button-loader"></span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
                
                <div className="register-footer">
                    <p>Already have an account? <Link to="/login" className="login-link">Sign In</Link></p>
                </div>
                
                <div className="secure-register-info">
                    <i className="secure-icon">🔐</i>
                    <p>Your personal information is secure with 256-bit encryption</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
