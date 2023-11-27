const loginFieldMapping = require('../models/login-field-mappings');

const mapLoginFormToApi = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("00000", formData);

      // Fetch field mappings from MongoDB
      const fieldMappings = await loginFieldMapping.find();
      console.log("1234", fieldMappings);

      // Create the API request based on field mappings
      const apiRequest = {};

      for (const { formField, apiField } of fieldMappings) {
        // Check if the form field exists in formData
        if (formData.hasOwnProperty(formField)) {
          // Map the form field value to the API field
          apiRequest[apiField] = formData[formField];
        } else {
          // Handle the case where a form field is missing in formData
          console.error(`Form field "${formField}" is missing in the formData.`);
          // Optionally, you can throw an error, log a message, or handle it in another way
          reject(apiRequest);
        }
      }

      // Resolve the promise with the mapped API request
      resolve(apiRequest);
    } catch (error) {
      console.error("Error mapping form to API:", error);
      reject({});
    }
  });
};

module.exports = mapLoginFormToApi;
