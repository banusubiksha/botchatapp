import { combineReducers } from 'redux';
import { SAVE_FORM_DATA, FormAction } from './action';

// Define the type for form data
interface FormData {
  name: string;
  qualification: string;
  phone: string;
  dob: string;
  about: string;
  skills: string;
  profilePhoto: string;
  document: string;
}

// Define the state structure
interface FormState {
  formData: FormData;
}

// Initial state
const initialState: FormState = {
  formData: {
    name: '',
    qualification: '',
    phone: '',
    dob: '',
    about: '',
    skills: '',
    profilePhoto: '',
    document: '',
  },
};

// Reducer function
const formReducer = (state = initialState, action: FormAction): FormState => {
  switch (action.type) {
    case SAVE_FORM_DATA:
      return { ...state, formData: action.payload };
    default:
      return state;
  }
};

// Combine reducers if you have multiple
const rootReducer = combineReducers({
  form: formReducer,
});

export default rootReducer;
