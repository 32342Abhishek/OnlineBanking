import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { investmentService, accountService, authService } from '../../api';
import authDiagnostic from '../../utils/authDiagnostic'; 
import apiDiagnostic from '../../utils/apiDiagnostic';
import './FixedDeposit.css';

const FixedDeposit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    tenureMonths: '12',
    interestPayoutFrequency: 'monthly'
  });

  const [accounts, setAccounts] = useState([]);
  const [fdRates, setFdRates] = useState([]);
  const [existingDeposits, setExistingDeposits] = useState([]);
  const [calculatedInterest, setCalculatedInterest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [applicationForm, setApplicationForm] = useState({
    accountNumber: '',
    amount: '',
    tenureMonths: 12,
    nomineeName: '',
    nomineeRelationship: '',
    autoRenew: false,
    maturityInstruction: 'PRINCIPAL_AND_INTEREST_TO_ACCOUNT'
  });

  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const [endpointTestResults, setEndpointTestResults] = useState(null);
  const [showEndpointTests, setShowEndpointTests] = useState(false);

  // Fetch real data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);
      setError('');
      
      try {
        // First check if user is authenticated
        const authStatus = authDiagnostic.checkAuthStatus();
        console.log('Auth status:', authStatus);
        
        if (!authStatus.isAuthenticated) {
          setError('You must be logged in to view your investments');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        // Fetch FD rates, accounts, and existing FDs in parallel
        const [ratesResponse, accountsResponse, existingDepositsResponse] = await Promise.all([
          investmentService.getFixedDepositRates().catch(err => {
            console.error('Error fetching FD rates:', err);
            return mockFdRates; // Fallback to mock data
          }),
          accountService.getAllAccounts().catch(err => {
            console.error('Error fetching accounts:', err);
            return []; // Empty array if failed
          }),
          investmentService.getAllFixedDeposits().catch(err => {
            console.error('Error fetching existing deposits:', err);
            return []; // Empty array if failed
          })
        ]);
        
        setFdRates(ratesResponse);
        setAccounts(accountsResponse);
        setExistingDeposits(existingDepositsResponse);
        
        // Set default account if available
        if (accountsResponse && accountsResponse.length > 0) {
          setApplicationForm(prev => ({
            ...prev,
            accountNumber: accountsResponse[0].accountNumber
          }));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setFetchingData(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  // Fallback mock data
  const mockFdRates = [
    { tenureMonths: 1, regularRate: 5.00, seniorCitizenRate: 5.50 },
    { tenureMonths: 3, regularRate: 5.50, seniorCitizenRate: 6.00 },
    { tenureMonths: 6, regularRate: 6.00, seniorCitizenRate: 6.50 },
    { tenureMonths: 12, regularRate: 6.50, seniorCitizenRate: 7.00 },
    { tenureMonths: 24, regularRate: 6.75, seniorCitizenRate: 7.25 },
    { tenureMonths: 36, regularRate: 7.00, seniorCitizenRate: 7.50 },
    { tenureMonths: 60, regularRate: 7.25, seniorCitizenRate: 7.75 },
    { tenureMonths: 120, regularRate: 7.50, seniorCitizenRate: 8.00 }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplicationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApplicationForm({
      ...applicationForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const calculateInterest = () => {
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setError('');
    
    // Find applicable rate
    const tenureMonths = parseInt(formData.tenureMonths);
    const rate = getFDRateForTenure(tenureMonths);
    
    const principal = parseFloat(formData.amount);
    
    // Calculate simple interest (for display purposes)
    const interestAmount = (principal * rate * (tenureMonths / 12)) / 100;
    const maturityAmount = principal + interestAmount;
    
    setCalculatedInterest({
      interest: interestAmount.toFixed(2),
      maturityAmount: maturityAmount.toFixed(2),
      rate: rate
    });
    
    // Update application form with calculated values
    setApplicationForm({
      ...applicationForm,
      amount: principal.toString(),
      tenureMonths: tenureMonths
    });
  };
  
  const getFDRateForTenure = (months) => {
    // Default rate if no rates available
    if (!fdRates || fdRates.length === 0) return 5.5;
    
    // Find the appropriate rate for the given tenure
    // Sort rates by tenure ascending
    const sortedRates = [...fdRates].sort((a, b) => a.tenureMonths - b.tenureMonths);
    
    // Find the closest tenure that is less than or equal to the requested tenure
    let applicableRate = sortedRates[0].regularRate;
    
    for (const rate of sortedRates) {
      if (rate.tenureMonths <= months) {
        applicableRate = rate.regularRate;
      } else {
        break;
      }
    }
    
    return parseFloat(applicableRate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (!applicationForm.accountNumber) {
      setError('Please select an account');
      setLoading(false);
      return;
    }
    
    if (!applicationForm.amount || isNaN(applicationForm.amount) || parseFloat(applicationForm.amount) <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }
    
    // Check authentication before submission
    const authStatus = authDiagnostic.checkAuthStatus();
    if (!authStatus.isAuthenticated) {
      setError('You must be logged in to create a fixed deposit');
      setTimeout(() => navigate('/login'), 2000);
      setLoading(false);
      return;
    }
    
    try {
      // Use real API call to create fixed deposit
      const response = await investmentService.createFixedDeposit({
        accountNumber: applicationForm.accountNumber,
        amount: parseFloat(applicationForm.amount),
        tenureMonths: parseInt(applicationForm.tenureMonths),
        nomineeName: applicationForm.nomineeName,
        nomineeRelationship: applicationForm.nomineeRelationship,
        autoRenew: applicationForm.autoRenew,
        maturityInstruction: applicationForm.maturityInstruction,
        interestPayoutFrequency: formData.interestPayoutFrequency
      });
      
      console.log('Fixed deposit created:', response);
      setSuccess('Your Fixed Deposit has been created successfully!');
      
      // Refresh the existing deposits list
      try {
        const updatedDeposits = await investmentService.getAllFixedDeposits();
        setExistingDeposits(updatedDeposits);
      } catch (refreshErr) {
        console.error('Failed to refresh deposits:', refreshErr);
      }
      
      // Reset form after successful submission
      setApplicationForm({
        accountNumber: accounts[0]?.accountNumber || '',
        amount: '',
        tenureMonths: 12,
        nomineeName: '',
        nomineeRelationship: '',
        autoRenew: false,
        maturityInstruction: 'PRINCIPAL_AND_INTEREST_TO_ACCOUNT'
      });
      
      // Avoid redirecting to dashboard to allow user to see confirmation
    } catch (err) {
      console.error('Error creating fixed deposit:', err);
      setError(err.message || 'Failed to create Fixed Deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const runDiagnostics = async () => {
    setError('');
    setShowDiagnostics(true);
    try {
      const results = await apiDiagnostic.testInvestmentEndpoints();
      setDiagnosticResults(results);
    } catch (err) {
      console.error('Error running diagnostics:', err);
      setError('Failed to run diagnostics: ' + err.message);
    }
  };

  const testEndpointVariations = async () => {
    setError('');
    setShowEndpointTests(true);
    try {
      const results = await apiDiagnostic.testEndpointVariations();
      setEndpointTestResults(results);
    } catch (err) {
      console.error('Error testing endpoint variations:', err);
      setError('Failed to test endpoint variations: ' + err.message);
    }
  };

  return (
    <div className="fd-container">
      <div className="fd-header">
        <h1>Fixed Deposit Investment</h1>
        <p className="subtitle">Secure your financial future with guaranteed returns</p>
        
        {/* Admin tools - hidden in production */}
        <div className="admin-tools" style={{ display: process.env.NODE_ENV === 'development' ? 'flex' : 'none', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={runDiagnostics} 
            className="diagnostic-btn"
            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
          >
            Run API Diagnostics
          </button>
          
          <button 
            onClick={testEndpointVariations} 
            className="endpoint-test-btn"
            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
          >
            Test API Endpoints
          </button>
        </div>
      </div>

      {/* Endpoint test results - hidden in production */}
      {showEndpointTests && process.env.NODE_ENV === 'development' && (
        <div className="endpoint-test-results diagnostic-panel">
          <h3>API Endpoint Test Results</h3>
          {endpointTestResults ? (
            <div>
              <p><strong>Base URL:</strong> {endpointTestResults.baseUrl}</p>
              <p><strong>Success:</strong> {endpointTestResults.success ? 'Yes' : 'No'}</p>
              
              <h4>Endpoint Variations</h4>
              <table className="diagnostic-table">
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Content Type</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {endpointTestResults.variations.map((variation, index) => (
                    <tr key={index}>
                      <td>{variation.url}</td>
                      <td>{variation.description}</td>
                      <td>{variation.status || 'N/A'}</td>
                      <td>{variation.contentType || 'N/A'}</td>
                      <td className={variation.success ? 'success-cell' : 'error-cell'}>
                        {variation.success ? 'Success' : (variation.error || 'Failed')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {endpointTestResults.success && (
                <div className="success-panel">
                  <p><strong>Found working endpoint!</strong> Please update your configuration to use one of the successful endpoints.</p>
                </div>
              )}
              
              {!endpointTestResults.success && (
                <div className="error-panel">
                  <p><strong>No working endpoints found.</strong> Please check your backend server configuration.</p>
                </div>
              )}
              
              <button onClick={() => setShowEndpointTests(false)} className="secondary-btn">
                Hide Test Results
              </button>
            </div>
          ) : (
            <p>Testing endpoints...</p>
          )}
        </div>
      )}

      {/* Diagnostic results - hidden in production */}
      {showDiagnostics && process.env.NODE_ENV === 'development' && (
        <div className="diagnostic-results diagnostic-panel">
          <h3>API Diagnostic Results</h3>
          {diagnosticResults ? (
            <div>
              <p><strong>Base URL:</strong> {diagnosticResults.baseUrl}</p>
              <p><strong>Success:</strong> {diagnosticResults.success ? 'Yes' : 'No'}</p>
              
              {/* Authentication status */}
              <div className="auth-status-panel">
                <h4>Authentication Status</h4>
                <p><strong>Has Token:</strong> {diagnosticResults.auth?.hasToken ? 'Yes' : 'No'}</p>
                {diagnosticResults.auth?.tokenValue && (
                  <p><strong>Token:</strong> {diagnosticResults.auth.tokenValue}</p>
                )}
                {diagnosticResults.auth?.tokenExpiry && (
                  <p><strong>Token Expires:</strong> {diagnosticResults.auth.tokenExpiry.toString()}</p>
                )}
                <p><strong>Token Expired:</strong> {diagnosticResults.auth?.isExpired ? 'Yes' : 'No'}</p>
                <p><strong>User Data:</strong> {diagnosticResults.auth?.hasUser ? 'Present' : 'Missing'}</p>
                
                {(!diagnosticResults.auth?.hasToken || diagnosticResults.auth?.isExpired) && (
                  <button 
                    onClick={() => navigate('/login')}
                    className="primary-btn"
                  >
                    Go to Login
                  </button>
                )}
              </div>
              
              {diagnosticResults.endpoints.fixedDeposit && (
                <div>
                  <p><strong>Fixed Deposit Endpoint:</strong> {diagnosticResults.endpoints.fixedDeposit.endpoint}</p>
                  <p><strong>Full URL:</strong> {diagnosticResults.endpoints.fixedDeposit.fullUrl}</p>
                  <p><strong>Normalized Endpoint:</strong> {diagnosticResults.endpoints.fixedDeposit.normalizedEndpoint}</p>
                  <p><strong>GET Status:</strong> {diagnosticResults.endpoints.fixedDeposit.getStatus || 'N/A'}</p>
                  {diagnosticResults.endpoints.fixedDeposit.getError && (
                    <p><strong>Error:</strong> {diagnosticResults.endpoints.fixedDeposit.getError}</p>
                  )}
                </div>
              )}
              
              {diagnosticResults.errors.length > 0 && (
                <div>
                  <p><strong>Errors:</strong></p>
                  <ul>
                    {diagnosticResults.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button onClick={() => setShowDiagnostics(false)} className="secondary-btn">
                Hide Diagnostics
              </button>
            </div>
          ) : (
            <p>Running diagnostics...</p>
          )}
        </div>
      )}

      {fetchingData ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading investment data...</p>
        </div>
      ) : (
        <div className="fd-content">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          {/* Show existing deposits if any */}
          {existingDeposits && existingDeposits.length > 0 && (
            <div className="existing-deposits section-card">
              <h2>Your Fixed Deposits</h2>
              <div className="deposits-list">
                {existingDeposits.map((deposit, index) => (
                  <div key={index} className="deposit-card">
                    <div className="deposit-header">
                      <h3>FD #{deposit.depositNumber || index + 1}</h3>
                      <span className="status-badge">{deposit.status || 'Active'}</span>
                    </div>
                    <div className="deposit-details">
                      <div className="deposit-detail-item">
                        <span className="detail-label">Principal Amount</span>
                        <span className="detail-value">₹{deposit.amount?.toLocaleString('en-IN') || 'N/A'}</span>
                      </div>
                      <div className="deposit-detail-item">
                        <span className="detail-label">Interest Rate</span>
                        <span className="detail-value">{deposit.interestRate}% p.a.</span>
                      </div>
                      <div className="deposit-detail-item">
                        <span className="detail-label">Tenure</span>
                        <span className="detail-value">{deposit.tenureMonths} months</span>
                      </div>
                      <div className="deposit-detail-item">
                        <span className="detail-label">Maturity Date</span>
                        <span className="detail-value">{deposit.maturityDate || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="fd-main-content">
            <div className="fd-calculator section-card">
              <h2>Fixed Deposit Calculator</h2>
              <div className="form-group">
                <label>Investment Amount (₹)</label>
                <div className="input-with-icon">
                  <span className="input-icon">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="1000"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tenure</label>
                <select name="tenureMonths" value={formData.tenureMonths} onChange={handleChange} className="select-styled">
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">1 Year</option>
                  <option value="24">2 Years</option>
                  <option value="36">3 Years</option>
                  <option value="60">5 Years</option>
                  <option value="120">10 Years</option>
                </select>
              </div>

              <div className="form-group">
                <label>Interest Payout Frequency</label>
                <select 
                  name="interestPayoutFrequency" 
                  value={formData.interestPayoutFrequency}
                  onChange={handleChange}
                  className="select-styled"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="cumulative">At Maturity</option>
                </select>
              </div>

              <button onClick={calculateInterest} className="primary-btn">
                Calculate Returns
              </button>

              {calculatedInterest && (
                <div className="calculation-result">
                  <h3>Maturity Details</h3>
                  <div className="result-grid">
                    <div className="result-item">
                      <div className="result-label">Interest Rate</div>
                      <div className="result-value">{calculatedInterest.rate}% p.a.</div>
                    </div>
                    <div className="result-item">
                      <div className="result-label">Total Interest</div>
                      <div className="result-value">₹{calculatedInterest.interest}</div>
                    </div>
                    <div className="result-item highlight">
                      <div className="result-label">Maturity Amount</div>
                      <div className="result-value">₹{calculatedInterest.maturityAmount}</div>
                    </div>
                  </div>
                  <button 
                    className="secondary-btn"
                    onClick={() => document.getElementById('fd-application-form').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Apply for this FD
                  </button>
                </div>
              )}
            </div>

            <div id="fd-application-form" className="fd-application section-card">
              <h2>Create Fixed Deposit</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select Account</label>
                  <select 
                    name="accountNumber"
                    value={applicationForm.accountNumber}
                    onChange={handleApplicationChange}
                    required
                    className="select-styled"
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account, index) => (
                      <option key={index} value={account.accountNumber}>
                        {account.accountNumber} - Balance: ₹{account.balance?.toLocaleString('en-IN') || 'N/A'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>FD Amount (₹)</label>
                  <div className="input-with-icon">
                    <span className="input-icon">₹</span>
                    <input
                      type="number"
                      name="amount"
                      value={applicationForm.amount}
                      onChange={handleApplicationChange}
                      min="1000"
                      placeholder="Min ₹1,000"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tenure</label>
                  <select 
                    name="tenureMonths"
                    value={applicationForm.tenureMonths}
                    onChange={handleApplicationChange}
                    required
                    className="select-styled"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">1 Year</option>
                    <option value="24">2 Years</option>
                    <option value="36">3 Years</option>
                    <option value="60">5 Years</option>
                    <option value="120">10 Years</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nominee Name</label>
                    <input
                      type="text"
                      name="nomineeName"
                      value={applicationForm.nomineeName}
                      onChange={handleApplicationChange}
                      placeholder="Enter nominee name"
                      className="input-styled"
                    />
                  </div>

                  <div className="form-group">
                    <label>Nominee Relationship</label>
                    <input
                      type="text"
                      name="nomineeRelationship"
                      value={applicationForm.nomineeRelationship}
                      onChange={handleApplicationChange}
                      placeholder="E.g., Spouse, Child, Parent"
                      className="input-styled"
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="autoRenew"
                    name="autoRenew"
                    checked={applicationForm.autoRenew}
                    onChange={handleApplicationChange}
                  />
                  <label htmlFor="autoRenew">Auto-renew on maturity</label>
                </div>

                <div className="form-group">
                  <label>Maturity Instruction</label>
                  <select
                    name="maturityInstruction"
                    value={applicationForm.maturityInstruction}
                    onChange={handleApplicationChange}
                    className="select-styled"
                  >
                    <option value="PRINCIPAL_AND_INTEREST_TO_ACCOUNT">Principal + Interest to Account</option>
                    <option value="PRINCIPAL_TO_ACCOUNT_INTEREST_PAYOUT">Principal to Account, Interest Payout</option>
                    <option value="REINVEST_WITH_INTEREST">Reinvest with Interest</option>
                    <option value="REINVEST_PRINCIPAL_ONLY">Reinvest Principal Only</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="primary-btn submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Create Fixed Deposit'}
                </button>
              </form>
            </div>
          </div>
          
          {/* FD Rates Table */}
          <div className="fd-rates section-card">
            <h2>Current Fixed Deposit Interest Rates</h2>
            <div className="table-responsive">
              <table className="rates-table">
                <thead>
                  <tr>
                    <th>Tenure</th>
                    <th>Regular Rate (p.a.)</th>
                    <th>Senior Citizen Rate (p.a.)</th>
                  </tr>
                </thead>
                <tbody>
                  {fdRates.map((rate, index) => (
                    <tr key={index}>
                      <td>
                        {rate.tenureMonths < 12 
                          ? `${rate.tenureMonths} Months` 
                          : `${rate.tenureMonths / 12} Year${rate.tenureMonths / 12 > 1 ? 's' : ''}`}
                      </td>
                      <td>{rate.regularRate}%</td>
                      <td>{rate.seniorCitizenRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedDeposit;