import React, { useState } from 'react';
import { 
  Info, 
  HelpCircle, 
  Plus, 
  ExternalLink,
  RefreshCw,
  Send
} from 'lucide-react';

interface FormData {
  agentName: string;
  tags: string[];
  autoAcceptJobs: boolean;
  agentClassification: string;
  agentAddress: string;
  briefDescription: string;
  authorBio: string;
  isFree: boolean;
}

interface FormErrors {
  agentName?: string;
  agentClassification?: string;
  agentAddress?: string;
  briefDescription?: string;
  authorBio?: string;
}

const AgentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    agentName: '',
    tags: [],
    autoAcceptJobs: true,
    agentClassification: '',
    agentAddress: '',
    briefDescription: '',
    authorBio: '',
    isFree: true
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentTag, setCurrentTag] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.agentName.trim()) {
      newErrors.agentName = 'Agent name is required';
    }
    
    if (!formData.agentClassification) {
      newErrors.agentClassification = 'Agent classification is required';
    }
    
    if (!formData.agentAddress.trim()) {
      newErrors.agentAddress = 'Agent address is required';
    } else if (!formData.agentAddress.startsWith('https://')) {
      newErrors.agentAddress = 'Agent address must be a valid HTTPS URL';
    }
    
    if (!formData.briefDescription.trim()) {
      newErrors.briefDescription = 'Brief description is required';
    }
    
    if (!formData.authorBio.trim()) {
      newErrors.authorBio = 'Author bio is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleAddTag = (): void => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (): void => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    }
  };

  const handleReset = (): void => {
    setFormData({
      agentName: '',
      tags: [],
      autoAcceptJobs: true,
      agentClassification: '',
      agentAddress: '',
      briefDescription: '',
      authorBio: '',
      isFree: true
    });
    setErrors({});
    setCurrentTag('');
  };

  const toggleStyle = {
    backgroundColor: formData.autoAcceptJobs ? '#2563eb' : '#e5e7eb'
  };

  const toggleStyleFree = {
    backgroundColor: formData.isFree ? '#2563eb' : '#e5e7eb'
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl border border-gray-200"
    
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Deploy Agent Based on Aladdin Protocol
        </h1>
        
        {/* Info Cards */}
        {/* <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3 p-4 bg-sky-50">
            <Info className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-sky-800">
              <strong>Agent payment is result-oriented</strong>, meaning payment is based on the Agent's execution results. 
              Funds are temporarily held in escrow by the open-source <strong>Aladdin Protocol</strong> contract.
            </p>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-sky-50">
            <Info className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-sky-800">
              The settlement process is automatically completed using a third-party verification system. 
              In case of disputes, the DAO committee will make the final decision.
            </p>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-sky-50">
            <Info className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-sky-800">
              Before settlement, the Agent's funds are held in escrow by the contract and can earn 
              additional stablecoin staking rewards.
            </p>
          </div>
        </div> */}
      </div>

      {/* Form with Label-Content Layout */}
      <div className="space-y-6">
        {/* Agent Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:text-right">
            <label className="flex md:justify-end items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Agent Name</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              value={formData.agentName}
              onChange={(e) => handleInputChange('agentName', e.target.value)}
              placeholder="Enter Agent name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.agentName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.agentName && (
              <p className="text-red-500 text-sm mt-1">{errors.agentName}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:text-right">
            <label className="flex md:justify-end items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Tags</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter tags and press Enter to add"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                e.g., data analysis, automation, AI assistant
              </p>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-sky-600 hover:text-sky-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auto Accept Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:text-right">
            <label className="flex md:justify-end items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Auto Accept Jobs</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleInputChange('autoAcceptJobs', !formData.autoAcceptJobs)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={toggleStyle}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.autoAcceptJobs ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600">Auto accept jobs</span>
            </div>
          </div>
        </div>

        {/* Agent Classification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:text-right">
            <label className="flex md:justify-end items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Agent Classification</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
          </div>
          <div className="md:col-span-2">
            <select
              value={formData.agentClassification}
              onChange={(e) => handleInputChange('agentClassification', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.agentClassification ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Agent classification</option>
              <option value="data-analysis">Data Analysis</option>
              <option value="automation">Automation</option>
              <option value="ai-assistant">AI Assistant</option>
              <option value="research">Research</option>
              <option value="creative">Creative</option>
              <option value="other">Other</option>
            </select>
            {errors.agentClassification && (
              <p className="text-red-500 text-sm mt-1">{errors.agentClassification}</p>
            )}
          </div>
        </div>

        {/* Agent Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:text-right">
            <label className="flex md:justify-end items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Agent Address</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-2">
              <input
                type="url"
                value={formData.agentAddress}
                onChange={(e) => handleInputChange('agentAddress', e.target.value)}
                placeholder="Enter Agent address (e.g., https://api.example.com)"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.agentAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                className="inline-flex items-center space-x-1 text-sky-600 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md p-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">View API Call Example</span>
              </button>
            </div>
            {errors.agentAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.agentAddress}</p>
            )}
          </div>
        </div>

        {/* Brief Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:text-right">
            <label className="flex md:justify-end items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Brief Description</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
          </div>
          <div className="md:col-span-2">
            <textarea
              value={formData.briefDescription}
              onChange={(e) => handleInputChange('briefDescription', e.target.value)}
              placeholder="Briefly describe the functionality of this Agent"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-vertical ${
                errors.briefDescription ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.briefDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.briefDescription}</p>
            )}
          </div>
        </div>

        {/* Author Bio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:text-right">
            <label className="flex md:justify-end items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Author Bio</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
          </div>
          <div className="md:col-span-2">
            <textarea
              value={formData.authorBio}
              onChange={(e) => handleInputChange('authorBio', e.target.value)}
              placeholder="Introduce your professional background, skills, or team experience, e.g.: 3 years of AI development experience, specializing in natural language processing..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-vertical ${
                errors.authorBio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.authorBio && (
              <p className="text-red-500 text-sm mt-1">{errors.authorBio}</p>
            )}
          </div>
        </div>

        {/* Is Free */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:text-right">
            <label className="flex md:justify-end items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Is Free</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleInputChange('isFree', !formData.isFree)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={toggleStyleFree}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isFree ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center space-x-2 px-6 py-3 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          style={{ backgroundColor: '#2563eb' }}
        >
          <span>Deploy</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AgentForm;