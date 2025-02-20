/* eslint-disable @typescript-eslint/no-explicit-any */
// demo/src/App.tsx
import type React from "react";
import "./App.css"; // Using SCSS now!
import { createSchema, useForm } from "forgeform";
import { buildRegex } from "forgeform";

interface Address {
  street: string;
  city: string;
  zip: string;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  age: number;
  ageRange: string;
  phone: string;
  website: string;
  countryCode: string;
  color: string;
  birthDate: string;
  terms: boolean;
  address: Address;
}

// Define country code options for the select field
const countryCodeOptions = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  // Add more countries as needed
];

// Create the form schema using our DSL parser.
// We also add some sanitization options (trim, lowercase) and a custom validator for password confirmation.
const schema = createSchema<FormData>({
  fields: {
    email: {
      type: "email",
      required: true,
      minLength: 5,
      trim: true,
      lowercase: true,
      // You can use a custom error message:
      requiredErrorMessage: "Email is required.",
    },
    password: {
      type: "password",
      required: true,
      minLength: 8,
      trim: true,
      // Custom error message example:
      minLengthErrorMessage: "Password must be at least 8 characters.",
    },
    confirmPassword: {
      type: "custom",
      required: true,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      customValidator: (value: unknown, data: { password: any; }) =>
        value === data?.password ? undefined : "Passwords do not match.",
    },
    fullName: {
      type: "string",
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
      format: 'alphaSpace',
      formatErrorMessage: 'Full name should only contain letters and spaces.',
    },
    age: {
      type: "number",
      required: true,
      min: 18,
      max: 120,
      // Custom error messages can be added as needed.
    },
    ageRange: {
      type: "string",
      required: true,
      customValidator: (value) => {
        if (!value) return "Age range is required.";
        const regex = /^(\d+)-(\d+)$/;
        if (!regex.test(value)) return "Age range must be in the format 'number-number' (e.g., 20-30).";
        const match = value.match(regex);
        if (match) {
          const minAge = parseInt(match[1], 10);
          const maxAge = parseInt(match[2], 10);
          if (minAge >= maxAge) return "Invalid age range: minimum age must be less than maximum age.";
          if (minAge < 0 || maxAge > 150) return "Age range is out of realistic bounds."; // Example bounds
        }
        return undefined;
      },
    },
    phone: {
      type: "tel",
      required: true,
      trim: true,
      // Use our regex builder to supply a regex pattern for phone numbers:
      pattern: buildRegex({ type: "phone" }).source,
      patternErrorMessage: "Please enter a valid phone number.",
    },
    website: {
      type: "url",
      required: false,
      trim: true,
      // Optionally, you could add a custom pattern here too.
    },
    countryCode: {
      type: "select",
      required: true,
      options: countryCodeOptions,
      // Example of using a regex for format (though 'enum' might be better for country codes)
      pattern: buildRegex({ type: "countryCode" }).source,
      patternErrorMessage: "Please select a valid country code.",
    },
    color: {
      type: "color",
      required: false, // Or true, depending on your form needs
    },
    birthDate: {
      type: "date",
      required: false,
      maxDate: new Date(), // Example: cannot be a future date
      maxDateErrorMessage: "Birth date cannot be in the future.",
    },
    terms: {
      type: "checkbox",
      required: true,
      requiredErrorMessage: "You must agree to the terms and conditions.",
    },
    address: {
      type: "object",
      required: true,
      schema: {
        fields: {
          street: {
            type: "string",
            required: true,
            trim: true,
          },
          city: {
            type: "string",
            required: true,
            trim: true,
          },
          zip: {
            type: "string",
            required: true,
            // Use our built-in zip regex pattern:
            pattern: buildRegex({ type: "zip" }).source,
            patternErrorMessage: "Invalid ZIP code format.",
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  const { formData, errors, handleChange, handleSubmit, validating } = useForm<FormData>({
    schema,
    onSubmit: (data) => {
      console.log("Submitted Data:", data);
      alert("Form submitted! Check console for data.");
    },
  });

  return (
    <div className="app-container">
      <header className="landing-header">
        <div className="header-content">
          <h1 className="main-title">ForgeForm</h1>
          <p className="subtitle">Robust Form Validation for React, Simplified.</p>
          <div className="badges">
            <a href="https://www.npmjs.com/package/forgeform" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/npm/v/forgeform.svg?style=for-the-badge" alt="NPM Package" />
            </a>
            <a href="https://github.com/Ajwebdevs/ForgeForm" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/github/stars/Ajwebdevs/ForgeForm?style=for-the-badge&logo=github" alt="GitHub Repository" />
            </a>
          </div>
          <p className="intro-text">
            ForgeForm is a lightweight and powerful form validation library for React applications.
            Define your form schema and let ForgeForm handle the validation, error handling, and state management.
          </p>
        </div>
      </header>

      <main className="main-content">
        <section className="form-section">
          <h2 className="section-title">Demo Form</h2>
          <form onSubmit={handleSubmit} className="demo-form">
            <div className="field">
              <label htmlFor="email" className="label">
                Email <span className="field-type">(email, required)</span>
              </label>
              <input
                id="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
              />
              {errors?.email && <span className="error">{errors.email.error}</span>}
            </div>

            <div className="field">
              <label htmlFor="password" className="label">
                Password <span className="field-type">(password, min 8 chars, required)</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                value={formData.password}
                onChange={handleChange}
              />
              {errors?.password && <span className="error">{errors.password.error}</span>}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword" className="label">
                Confirm Password <span className="field-type">(must match password, required)</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="input"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors?.confirmPassword && (
                <span className="error">{errors.confirmPassword.error}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="fullName" className="label">
                Full Name <span className="field-type">(letters and spaces only, required)</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="input"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors?.fullName && <span className="error">{errors.fullName.error}</span>}
            </div>

            <div className="field">
              <label htmlFor="age" className="label">
                Age <span className="field-type">(number, 18-120, required)</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                className="input"
                value={formData.age || ""}
                onChange={handleChange}
              />
              {errors?.age && <span className="error">{errors.age.error}</span>}
            </div>

            <div className="field">
              <label htmlFor="ageRange" className="label">
                Age Range <span className="field-type">(custom validator, required)</span>
              </label>
              <input
                id="ageRange"
                name="ageRange"
                type="text"
                className="input"
                value={formData.ageRange || ""}
                onChange={handleChange}
              />
              {errors?.ageRange && <span className="error">{errors.ageRange.error}</span>}
            </div>


            <div className="field">
              <label htmlFor="phone" className="label">
                Phone <span className="field-type">(tel, phone regex, required)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors?.phone && <span className="error">{errors.phone.error}</span>}
            </div>

            <div className="field">
              <label htmlFor="website" className="label">
                Website <span className="field-type">(url, optional)</span>
              </label>
              <input
                id="website"
                name="website"
                type="url"
                className="input"
                value={formData.website}
                onChange={handleChange}
              />
              {errors?.website && <span className="error">{errors.website.error}</span>}
            </div>

            <div className="field">
              <label htmlFor="countryCode" className="label">
                Country Code <span className="field-type">(select, countryCode regex, required)</span>
              </label>
              <select
                id="countryCode"
                name="countryCode"
                className="input select-input"
                value={formData.countryCode}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                {countryCodeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.countryCode && <span className="error">{errors.countryCode.error}</span>}
            </div>

            <div className="field">
              <label htmlFor="color" className="label">
                Favorite Color <span className="field-type">(color, optional)</span>
              </label>
              <input
                id="color"
                name="color"
                type="color"
                className="input color-input"
                value={formData.color}
                onChange={handleChange}
              />
              {errors?.color && <span className="error">{errors.color.error}</span>}
            </div>

            <div className="field">
              <label htmlFor="birthDate" className="label">
                Birth Date <span className="field-type">(date, not future, optional)</span>
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                className="input date-input"
                value={formData.birthDate}
                onChange={handleChange}
              />
              {errors?.birthDate && <span className="error">{errors.birthDate.error}</span>}
            </div>

            <div className="field checkbox-field">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="checkbox"
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="terms" className="label terms-label">
                I agree to the Terms and Conditions <span className="field-type">(checkbox, required)</span>
              </label>
              {errors?.terms && <span className="error">{errors.terms.error}</span>}
            </div>


            <div className="field address-field">
              <h3 className="nested-header">Address <span className="field-type">(object, required)</span></h3>
              <div className="nested-field">
                <label htmlFor="address.street" className="label">
                  Street <span className="field-type">(string, required)</span>
                </label>
                <input
                  id="address.street"
                  name="address.street"
                  className="input"
                  value={formData.address?.street || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="nested-field">
                <label htmlFor="address.city" className="label">
                  City <span className="field-type">(string, required)</span>
                </label>
                <input
                  id="address.city"
                  name="address.city"
                  className="input"
                  value={formData.address?.city || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="nested-field">
                <label htmlFor="address.zip" className="label">
                  ZIP Code <span className="field-type">(string, zip regex, required)</span>
                </label>
                <input
                  id="address.zip"
                  name="address.zip"
                  className="input"
                  value={formData.address?.zip || ""}
                  onChange={handleChange}
                />
              </div>
              {errors?.address && (
                <span className="error">{errors.address.error}</span>
              )}
            </div>

            <button type="submit" disabled={validating} className="submit-button">
              {validating ? "Validating..." : "Submit"}
            </button>
          </form>
        </section>

        <section className="documentation-section">
          <h2 className="section-title doc-header">Documentation</h2>

          <p>
            <a href="https://www.npmjs.com/package/forgeform" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/npm/v/forgeform.svg?style=for-the-badge" alt="NPM Package" />
            </a>
            &nbsp;
            <a href="https://github.com/Ajwebdevs/ForgeForm" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/github/stars/Ajwebdevs/ForgeForm?style=for-the-badge&logo=github" alt="GitHub Repository" />
            </a>
          </p>

          <h3 className="doc-subheader">Schema Definition with <code>createSchema</code></h3>
          <p>
            ForgeForm utilizes a declarative schema definition using the <code>createSchema</code> function. This function allows you to define your form structure, validation rules, and sanitization options in a clear, JSON-like format. Let's break down the schema used in this demo:
          </p>

          <pre className="doc-code-block">
            <code className="language-typescript">
{`const schema = createSchema<FormData>({
  fields: {
    email: {
      type: "email",
      required: true,
      minLength: 5,
      trim: true,
      lowercase: true,
      requiredErrorMessage: "Email is required.",
    },
    password: {
      type: "password",
      required: true,
      minLength: 8,
      trim: true,
      minLengthErrorMessage: "Password must be at least 8 characters.",
    },
    confirmPassword: {
      type: "custom",
      required: true,
      customValidator: (value, data) =>
        value === data?.password ? undefined : "Passwords do not match.",
    },
    fullName: {
      type: "string",
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
      format: 'alphaSpace',
      formatErrorMessage: 'Full name should only contain letters and spaces.',
    },
    age: {
      type: "number",
      required: true,
      min: 18,
      max: 120,
    },
    ageRange: {
      type: "string",
      required: true,
      customValidator: (value) => { /* ... custom validator ... */ },
    },
    phone: {
      type: "tel",
      required: true,
      trim: true,
      pattern: buildRegex({ type: "phone" }).source,
      patternErrorMessage: "Please enter a valid phone number.",
    },
    website: {
      type: "url",
      required: false,
      trim: true,
    },
    countryCode: {
      type: "select",
      required: true,
      options: countryCodeOptions,
      pattern: buildRegex({ type: "countryCode" }).source,
      patternErrorMessage: "Please select a valid country code.",
    },
    color: {
      type: "color",
      required: false,
    },
    birthDate: {
      type: "date",
      required: false,
      maxDate: new Date(),
      maxDateErrorMessage: "Birth date cannot be in the future.",
    },
    terms: {
      type: "checkbox",
      required: true,
      requiredErrorMessage: "You must agree to the terms and conditions.",
    },
    address: {
      type: "object",
      required: true,
      schema: {
        fields: {
          street: {
            type: "string",
            required: true,
            trim: true,
          },
          city: {
            type: "string",
            required: true,
            trim: true,
          },
          zip: {
            type: "string",
            required: true,
            pattern: buildRegex({ type: "zip" }).source,
            patternErrorMessage: "Invalid ZIP code format.",
          },
        },
      },
    },
  },
});`}
            </code>
          </pre>

          <h4 className="doc-subheader-minor">Key Components of the Schema:</h4>
          <ul>
            <li>
              <code>fields</code>: This is the main container for all form fields. It's an object where keys are field names (matching your <code>FormData</code> interface) and values are <code>FieldSchema</code> definitions.
            </li>
            <li>
              <code>FieldSchema</code>: Each field is defined using a <code>FieldSchema</code>, which is an object containing:
              <ul>
                <li><code>type</code>:  Specifies the data type and input type of the field (e.g., <code>"email"</code>, <code>"password"</code>, <code>"number"</code>, <code>"select"</code>, <code>"checkbox"</code>, <code>"object"</code>, etc.).</li>
                <li><code>required</code>: A boolean indicating if the field is mandatory.</li>
                <li>Validation Rules:  Options like <code>minLength</code>, <code>maxLength</code>, <code>min</code>, <code>max</code>, <code>pattern</code>, <code>format</code>, <code>customValidator</code>, <code>asyncValidator</code>, and more to define validation logic.</li>
                <li>Sanitization: Options like <code>trim</code>, <code>lowercase</code>, <code>uppercase</code> to automatically sanitize input values.</li>
                <li>Error Messages:  Customizable error messages for each validation rule (e.g., <code>requiredErrorMessage</code>, <code>minLengthErrorMessage</code>, <code>patternErrorMessage</code>).</li>
                <li>Nested Schemas: For <code>type: "object"</code> and <code>type: "array"</code>, you can define nested <code>schema</code> to handle complex data structures.</li>
                <li>Input Specific Options: For UI components like <code>"select"</code> and <code>"radio"</code>, the <code>options</code> array provides data for dropdowns or radio groups.</li>
              </ul>
            </li>
            <li>
              <code>buildRegex</code>: The <code>buildRegex</code> function is used to leverage ForgeForm's built-in regex validators. For example, <code>pattern: buildRegex(&#123; type: "phone" &#125;).source</code> applies the pre-defined phone number regex.
            </li>
          </ul>

          <h3 className="doc-subheader">Using the <code>useForm</code> Hook</h3>
          <p>
            The <code>useForm</code> hook is the bridge between your schema and your React form component. It simplifies form state management and validation handling.
          </p>
          <pre className="doc-code-block">
            <code className="language-typescript">
{`const { formData, errors, handleChange, handleSubmit, validating } = useForm<FormData>({
  schema,
  onSubmit: (data) => {
    console.log("Submitted Data:", data);
    alert("Form submitted! Check console for data.");
  },
});`}
            </code>
          </pre>
          <h4 className="doc-subheader-minor">What <code>useForm</code> Returns:</h4>
          <ul>
            <li><code>formData</code>:  An object holding the current form data, structured according to your <code>FormData</code> interface.</li>
            <li><code>errors</code>: An object containing validation errors. Each field with an error will have a corresponding property in this object, with details about the error.</li>
            <li><code>handleChange</code>:  A handler function to update the <code>formData</code> when input fields change. Wire this to your input's <code>onChange</code> event.</li>
            <li><code>handleSubmit</code>:  A handler function to trigger form validation and, if valid, call your <code>onSubmit</code> callback. Wire this to your form's <code>onSubmit</code> event.</li>
            <li><code>validating</code>: A boolean state that is <code>true</code> while asynchronous validation is in progress (if you use <code>asyncValidator</code>s).</li>
          </ul>

          <p>
            By combining <code>createSchema</code> and <code>useForm</code>, ForgeForm provides a type-safe, declarative, and efficient way to handle form validation in your React applications. Explore the various <code>FieldType</code> options and validators to build robust and user-friendly forms!
          </p>
        </section>
      </main>

      <footer className="main-footer">
        <p>
          &copy; {new Date().getFullYear()} ForgeForm.  |  Developed by <a href="https://github.com/Ajwebdevs" target="_blank" rel="noopener noreferrer">Ajwebdevs</a>
        </p>
      </footer>
    </div>
  );
};

export default App;