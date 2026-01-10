import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addLead } from '../../store/slices/leadSlice';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';

const ImportLeads = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Review, 4: Import
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileContent, setFileContent] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [importData, setImportData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [importResults, setImportResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importOptions, setImportOptions] = useState({
    updateExisting: false,
    skipDuplicates: true,
    sendWelcomeEmail: false,
    assignTo: 'current-user',
    defaultStatus: 'new',
    defaultSource: 'import',
  });
  
  // Available fields in our system
  const systemFields = [
    { id: 'name', label: 'Full Name', required: true },
    { id: 'email', label: 'Email Address', required: true },
    { id: 'phone', label: 'Phone Number', required: false },
    { id: 'company', label: 'Company', required: false },
    { id: 'jobTitle', label: 'Job Title', required: false },
    { id: 'status', label: 'Status', required: false },
    { id: 'source', label: 'Source', required: false },
    { id: 'value', label: 'Lead Value', required: false },
    { id: 'notes', label: 'Notes', required: false },
  ];
  
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    setFileType(uploadedFile.name.split('.').pop().toLowerCase());
    
    // Check if file is supported
    if (!['csv', 'xlsx', 'xls'].includes(fileType)) {
      alert('Please upload a CSV or Excel file.');
      return;
    }
    
    setIsLoading(true);
    
    if (fileType === 'csv') {
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setFileContent(results.data);
            setHeaders(results.meta.fields || Object.keys(results.data[0]));
            initializeFieldMapping(results.meta.fields || Object.keys(results.data[0]));
          }
          setIsLoading(false);
          setStep(2); // Move to mapping step
        },
        error: (error) => {
          alert('Error reading file: ' + error.message);
          setIsLoading(false);
        },
      });
    } else {
      // For Excel files, we'd use a library like xlsx
      // For now, simulate with mock data
      setTimeout(() => {
        const mockData = Array.from({ length: 10 }, (_, i) => ({
          name: `Lead ${i + 1}`,
          email: `lead${i + 1}@example.com`,
          phone: `+62${8000000000 + i}`,
          company: `Company ${(i % 5) + 1}`,
          'job title': ['CEO', 'Manager', 'Developer', 'Sales'][i % 4],
          status: ['new', 'contacted'][i % 2],
          source: ['website', 'referral', 'social'][i % 3],
          value: (10000 + i * 1000).toString(),
          notes: `Notes for lead ${i + 1}`,
        }));
        
        setFileContent(mockData);
        setHeaders(Object.keys(mockData[0]));
        initializeFieldMapping(Object.keys(mockData[0]));
        setIsLoading(false);
        setStep(2);
      }, 1000);
    }
  };
  
  const initializeFieldMapping = (fileHeaders) => {
    const initialMapping = {};
    
    fileHeaders.forEach((header) => {
      // Try to auto-detect matches
      const headerLower = header.toLowerCase();
      let matchedField = null;
      
      if (headerLower.includes('name')) matchedField = 'name';
      else if (headerLower.includes('email')) matchedField = 'email';
      else if (headerLower.includes('phone') || headerLower.includes('mobile')) matchedField = 'phone';
      else if (headerLower.includes('company') || headerLower.includes('org')) matchedField = 'company';
      else if (headerLower.includes('title') || headerLower.includes('position')) matchedField = 'jobTitle';
      else if (headerLower.includes('status')) matchedField = 'status';
      else if (headerLower.includes('source')) matchedField = 'source';
      else if (headerLower.includes('value') || headerLower.includes('amount')) matchedField = 'value';
      else if (headerLower.includes('notes') || headerLower.includes('comment')) matchedField = 'notes';
      
      initialMapping[header] = matchedField || '';
    });
    
    setFieldMapping(initialMapping);
  };
  
  const handleFieldMapping = (fileHeader, systemField) => {
    setFieldMapping({
      ...fieldMapping,
      [fileHeader]: systemField,
    });
  };
  
  const validateData = () => {
    const errors = [];
    
    // Check required fields are mapped
    const requiredFields = systemFields.filter(f => f.required);
    requiredFields.forEach((field) => {
      const isMapped = Object.values(fieldMapping).includes(field.id);
      if (!isMapped) {
        errors.push(`Required field "${field.label}" is not mapped`);
      }
    });
    
    // Validate individual rows
    fileContent.forEach((row, index) => {
      // Check email format
      const emailField = Object.keys(fieldMapping).find(key => fieldMapping[key] === 'email');
      if (emailField && row[emailField]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row[emailField])) {
          errors.push(`Row ${index + 1}: Invalid email format "${row[emailField]}"`);
        }
      }
      
      // Check required fields have values
      requiredFields.forEach((field) => {
        const mappedHeader = Object.keys(fieldMapping).find(key => fieldMapping[key] === field.id);
        if (mappedHeader && (!row[mappedHeader] || row[mappedHeader].trim() === '')) {
          errors.push(`Row ${index + 1}: Required field "${field.label}" is empty`);
        }
      });
    });
    
    setValidationErrors(errors);
    return errors.length === 0;
  };
  
  const prepareImportData = () => {
    if (!validateData()) {
      alert('Please fix validation errors before proceeding.');
      return;
    }
    
    const preparedData = fileContent.map((row) => {
      const mappedRow = {};
      
      Object.keys(fieldMapping).forEach((fileHeader) => {
        const systemField = fieldMapping[fileHeader];
        if (systemField && row[fileHeader] !== undefined) {
          mappedRow[systemField] = row[fileHeader];
        }
      });
      
      // Apply import options
      return {
        id: uuidv4(),
        name: mappedRow.name || '',
        email: mappedRow.email || '',
        phone: mappedRow.phone || '',
        company: mappedRow.company || '',
        jobTitle: mappedRow.jobTitle || '',
        status: mappedRow.status || importOptions.defaultStatus,
        source: mappedRow.source || importOptions.defaultSource,
        value: mappedRow.value ? parseFloat(mappedRow.value) || 0 : 0,
        notes: mappedRow.notes || '',
        assignedTo: importOptions.assignTo === 'current-user' ? 'Current User' : '',
        createdAt: new Date().toISOString(),
      };
    });
    
    setImportData(preparedData);
    setStep(3); // Move to review step
  };
  
  const handleImport = () => {
    setIsLoading(true);
    
    // Simulate import process
    setTimeout(() => {
      let successful = 0;
      let failed = 0;
      let duplicates = 0;
      
      importData.forEach((lead) => {
        try {
          // Check for duplicates based on email
          const isDuplicate = false; // In real app, check against existing leads
          
          if (isDuplicate && importOptions.skipDuplicates) {
            duplicates++;
            return;
          }
          
          dispatch(addLead(lead));
          successful++;
        } catch (error) {
          failed++;
        }
      });
      
      setImportResults({
        total: importData.length,
        successful,
        failed,
        duplicates,
        skipped: duplicates,
      });
      
      setIsLoading(false);
      setStep(4); // Move to results step
    }, 2000);
  };
  
  const resetImport = () => {
    setFile(null);
    setFileName('');
    setFileContent([]);
    setHeaders([]);
    setFieldMapping({});
    setImportData([]);
    setValidationErrors([]);
    setImportResults(null);
    setStep(1);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const downloadTemplate = () => {
    const templateHeaders = ['name', 'email', 'phone', 'company', 'jobTitle', 'status', 'source', 'value', 'notes'];
    const templateData = [
      ['John Doe', 'john@example.com', '+62123456789', 'Example Corp', 'CEO', 'new', 'website', '50000', 'Interested in CRM solution'],
      ['Jane Smith', 'jane@example.com', '+62123456788', 'Sample Inc', 'Manager', 'contacted', 'referral', '30000', 'Requested demo'],
    ];
    
    const csvContent = [templateHeaders, ...templateData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const renderStep1 = () => (
    <Card>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl mx-auto mb-4">
          📤
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Leads</h2>
        <p className="text-gray-600">
          Upload a CSV or Excel file to import leads into your CRM
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            file
              ? 'border-primary-300 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-2xl mx-auto mb-4">
            📁
          </div>
          
          {file ? (
            <div>
              <p className="font-medium text-gray-900">{fileName}</p>
              <p className="text-sm text-gray-500 mt-1">
                {fileContent.length} records detected
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  resetImport();
                }}
              >
                Choose Different File
              </Button>
            </div>
          ) : (
            <div>
              <p className="font-medium text-gray-900">Drop your file here or click to browse</p>
              <p className="text-sm text-gray-500 mt-1">
                Supports .csv, .xlsx, .xls files up to 10MB
              </p>
            </div>
          )}
        </div>
        
        {/* File Requirements */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">File Requirements:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              CSV or Excel format (UTF-8 encoding recommended)
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              First row should contain column headers
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              Required fields: Name, Email
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              Maximum file size: 10MB
            </li>
          </ul>
        </div>
        
        {/* Template Download */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            Don't have a template? Download ours:
          </p>
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center justify-center mx-auto"
          >
            📥 Download Template
          </Button>
        </div>
      </div>
    </Card>
  );
  
  const renderStep2 = () => (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Map Columns</h2>
        <p className="text-gray-600">
          Match your file columns with CRM fields
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Field Mapping Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">File Column</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Sample Data</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Map to CRM Field</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {headers.map((header, index) => {
                const sampleValue = fileContent[0]?.[header] || 'No data';
                const mappedField = fieldMapping[header];
                const isRequired = systemFields.find(f => f.id === mappedField)?.required || false;
                const isMapped = !!mappedField;
                
                return (
                  <tr key={header} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{header}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 truncate max-w-xs block">
                        {sampleValue}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={mappedField || ''}
                        onChange={(e) => handleFieldMapping(header, e.target.value)}
                      >
                        <option value="">-- Do not import --</option>
                        {systemFields.map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.label} {field.required && '*'}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {isMapped ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isRequired ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isRequired ? 'Required ✓' : 'Optional ✓'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Not mapped
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Import Options */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Import Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={importOptions.skipDuplicates}
                  onChange={(e) => setImportOptions({
                    ...importOptions,
                    skipDuplicates: e.target.checked,
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">Skip duplicate leads</span>
              </label>
              <p className="text-xs text-gray-500 ml-6 mt-1">
                Based on email address
              </p>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={importOptions.sendWelcomeEmail}
                  onChange={(e) => setImportOptions({
                    ...importOptions,
                    sendWelcomeEmail: e.target.checked,
                  })}
                />
                <span className="ml-2 text-sm text-gray-700">Send welcome email</span>
              </label>
              <p className="text-xs text-gray-500 ml-6 mt-1">
                To all imported leads
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={importOptions.defaultStatus}
                onChange={(e) => setImportOptions({
                  ...importOptions,
                  defaultStatus: e.target.value,
                })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Source
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={importOptions.defaultSource}
                onChange={(e) => setImportOptions({
                  ...importOptions,
                  defaultSource: e.target.value,
                })}
              >
                <option value="import">Import</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social">Social Media</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Validation Errors:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.slice(0, 5).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
              {validationErrors.length > 5 && (
                <li className="text-red-600">
                  ... and {validationErrors.length - 5} more errors
                </li>
              )}
            </ul>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
          >
            ← Back
          </Button>
          <Button
            variant="primary"
            onClick={prepareImportData}
            disabled={isLoading}
          >
            {isLoading ? 'Validating...' : 'Continue to Review →'}
          </Button>
        </div>
      </div>
    </Card>
  );
  
  const renderStep3 = () => (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Import</h2>
        <p className="text-gray-600">
          Preview {importData.length} leads before importing
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Import Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{importData.length}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {importData.filter(l => l.name && l.email).length}
              </div>
              <div className="text-sm text-gray-600">Valid Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {importOptions.skipDuplicates ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-gray-600">Skip Duplicates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {importOptions.defaultStatus}
              </div>
              <div className="text-sm text-gray-600">Default Status</div>
            </div>
          </div>
        </div>
        
        {/* Preview Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Company</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody>
              {importData.slice(0, 5).map((lead, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{lead.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-600">{lead.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-600">{lead.company || '-'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize">{lead.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">
                      ${lead.value ? lead.value.toLocaleString() : '0'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {importData.length > 5 && (
            <div className="text-center py-4 text-gray-500">
              ... and {importData.length - 5} more leads
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(2)}
          >
            ← Back to Mapping
          </Button>
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/leads')}
            >
              Cancel Import
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={isLoading}
            >
              {isLoading ? 'Importing...' : 'Start Import →'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
  
  const renderStep4 = () => (
    <Card>
      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${
          importResults.failed === 0
            ? 'bg-green-100 text-green-600'
            : importResults.successful > 0
            ? 'bg-yellow-100 text-yellow-600'
            : 'bg-red-100 text-red-600'
        }`}>
          {importResults.failed === 0 ? '✅' : importResults.successful > 0 ? '⚠️' : '❌'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete</h2>
        <p className="text-gray-600">
          Your leads have been imported successfully
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Results Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{importResults.total}</div>
            <div className="text-sm text-gray-600">Total Processed</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
            <div className="text-sm text-green-600">Successfully Imported</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
            <div className="text-sm text-red-600">Failed</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{importResults.skipped}</div>
            <div className="text-sm text-yellow-600">Skipped (Duplicates)</div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-3">What's Next?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/leads')}
              className="flex items-center justify-center"
            >
              📋 View All Leads
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                resetImport();
                setStep(1);
              }}
              className="flex items-center justify-center"
            >
              📤 Import More Leads
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center"
            >
              📊 Go to Dashboard
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/leads')}
              className="flex items-center justify-center"
            >
              ✏️ Manage Imported Leads
            </Button>
          </div>
        </div>
        
        {/* Failed Items (if any) */}
        {importResults.failed > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Failed Items</h4>
            <p className="text-sm text-red-700 mb-3">
              Some leads failed to import. You can download the error report and try importing again.
            </p>
            <Button variant="outline" size="sm">
              📥 Download Error Report
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
  
  const renderStepIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-center">
        {[1, 2, 3, 4].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber === step
                  ? 'bg-primary-600 text-white'
                  : stepNumber < step
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber < step ? '✓' : stepNumber}
              </div>
              <div className="text-xs mt-2 text-gray-600">
                {stepNumber === 1 && 'Upload'}
                {stepNumber === 2 && 'Map'}
                {stepNumber === 3 && 'Review'}
                {stepNumber === 4 && 'Complete'}
              </div>
            </div>
            {stepNumber < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                step > stepNumber ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Leads</h1>
          <p className="text-gray-600">Bulk import leads from CSV or Excel files</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/leads')}
        >
          ← Back to Leads
        </Button>
      </div>
      
      {/* Step Indicator */}
      {renderStepIndicator()}
      
      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      
      {/* Help Card */}
      {step !== 4 && (
        <Card>
          <div className="flex items-start">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-xl mr-4">
              💡
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Import Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use our template to ensure proper formatting</li>
                <li>• Clean your data before importing for best results</li>
                <li>• Required fields: Name and Email</li>
                <li>• Maximum 10,000 records per import</li>
                <li>• You can always edit imported leads later</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImportLeads;