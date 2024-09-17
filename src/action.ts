export const SAVE_FORM_DATA = 'SAVE_FORM_DATA';

// Define the form data type
export interface FormData {
  name: string;
  qualification: string;
  phone: string;
  dob: string;
  about: string;
  skills: string;
  profilePhoto: string;
  document: string;
}

// Action creator
export const saveFormData = (formData: FormData) => ({
  type: SAVE_FORM_DATA,
  payload: formData,
});

// Define the action type
export type FormAction = ReturnType<typeof saveFormData>;
