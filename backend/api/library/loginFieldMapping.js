const LoginFieldMapping = require('../models/login-field-mappings');

const mapLoginFormToApi = async (formData) => {
  try {
    console.log("777",formData)
    // Fetch field mappings from MongoDB
    const fieldMappings = await LoginFieldMapping.find();
    console.log("1234",fieldMappings);
    // Create the API request based on field mappings
    const apiRequest = {};

    for (const { formField, apiField } of fieldMappings) {
      // Check if the form field exists in formData
      if (formData.hasOwnProperty(formField)) {
        // Map the form field value to the API field
        apiRequest[apiField] = formData[formField];
        
      }else {
        // Handle the case where a form field is missing in formData
        console.error(`Form field "${formField}" is missing in the formData.`);
        // Optionally, you can throw an error, log a message, or handle it in another way
        return apiRequest
      }
    }
    //console.log("888",apiRequest)
    return apiRequest;
  } catch (error) {
    console.error("Error mapping form to API:", error);
    return {};
  }
};

module.exports = mapLoginFormToApi;
