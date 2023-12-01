const mapLoginFormToApi = async (formData, dataMapping) => {
  try {
    const apiRequest = {};

    for (const [formField, apiField] of Object.entries(dataMapping)) {
      if (formData.hasOwnProperty(formField)) {
        apiRequest[apiField] = formData[formField];
      } else {
        // Optionally, handle missing form fields
       // console.error(`Form field "${formField}" is missing in the formData.`);
        const error = `Form field "${formField}" is missing in the formData.`;
        throw new Error(error);

      }
    }
    
    return apiRequest;
  } catch (error) {
    //console.error("Error mapping form to API:", error);
    throw new Error(error);
    return {};
  }
};

export default mapLoginFormToApi;