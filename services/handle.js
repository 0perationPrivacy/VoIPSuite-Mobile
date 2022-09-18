import { userService } from ".";

export const handleResponse = (response) => {
 
  return response.text().then(text => {
    console.log('response ===>', response);
    console.log('response text ===>', text);
    
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if (response.status === 401) {
        userService.logout()
      }

      let valdidationErrors = {};
      if ('errors' in data) {
        valdidationErrors = data.errors?.errors
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject([error, valdidationErrors]);
    }

    return data;
  });
}