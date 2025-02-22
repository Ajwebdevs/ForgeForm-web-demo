// demo/src/RHFExample.tsx
import type React from "react";
import { useForm as useRHFForm } from "react-hook-form";
import { createSchema, forgeFormResolver } from "forgeform";

interface Address {
  street: string;
  city: string;
  zip: string;
}

interface FormData {
  email: string;
  fullName: string;
  age: number;
  birthDate: Date;
  terms: boolean;
  gender: string;
  country: string;
  address: Address;
  hobbies: string[];
  customField: string;
  rating: number;
  colors: string;
  description: string;
  schedule: Date;
  unionField: string | number;
  tupleField: [string, number];
  recordField: Record<string, number>;
}

const schema = createSchema<FormData>({
  fields: {
    email: {
      type: "email",
      required: true,
      minLength: 5,
      trim: true,
      lowercase: true,
      // Updated email regex requires at least one dot in the domain:
      pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.source,
      requiredErrorMessage: "Email is required.",
    },
    fullName: {
      type: "string",
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
      // Pattern: letters and spaces only
      pattern: /^[A-Za-z\s]+$/.source,
      patternErrorMessage: "Full name should only contain letters and spaces.",
    },
    age: {
      type: "number",
      required: true,
      min: 18,
      max: 120,
    },
    birthDate: {
      type: "date",
      required: true,
    },
    terms: {
      type: "boolean",
      required: true,
      requiredErrorMessage: "You must agree to the terms.",
    },
    gender: {
      type: "radio",
      required: true,
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
    },
    country: {
      type: "select",
      required: true,
      options: [
        { value: "US", label: "United States" },
        { value: "IN", label: "India" },
        { value: "GB", label: "United Kingdom" },
      ],
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
            // Accept 5-digit (US) or 6-digit (Indian) ZIP/postal codes:
            pattern: /^(?:\d{5}|\d{6})$/.source,
            patternErrorMessage: "Invalid ZIP/postal code.",
          },
        },
      },
    },
    hobbies: {
      type: "array",
      required: false,
      elementType: {
        type: "string",
        trim: true,
      },
      sanitize: (value: unknown) => {
        if (typeof value === 'string') {
          return value.split(',').map(item => item.trim());
        }
        return value;
      },
    },
    customField: {
      type: "custom",
      required: false,
      customValidator: (value: unknown) =>
        value === "foobar" ? undefined : "Custom field must be 'foobar'.",
    },
    rating: {
      type: "float",
      required: true,
      min: 0,
      max: 5,
    },
    colors: {
      type: "color",
      required: true,
    },
    description: {
      type: "textarea",
      required: false,
      trim: true,
      minLength: 10,
      maxLength: 500,
    },
    schedule: {
      type: "datetime-local",
      required: true,
    },
    unionField: {
      type: "union",
      required: true,
      unionErrorMessage: "Value must be either a number or a string.",
      types: [
        { type: "string", required: false },
        { type: "number", required: false },
      ],
    },
    tupleField: {
      type: "tuple",
      required: true,
      tupleSchemas: [
        { type: "string", required: true, trim: true },
        { type: "number", required: true, min: 0 },
      ],
      tupleLengthErrorMessage: "Tuple must contain exactly a string and a number.",
    },
    recordField: {
      type: "record",
      required: true,
      valueSchema: {
        type: "number",
        required: true,
      },
      recordErrorMessage: "Record values must be numbers.",
    },
  },
});

const RHFExample: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Import reset function
  } = useRHFForm<FormData>({
    resolver: forgeFormResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data Submitted:", data);
    reset(); // Optionally reset the form after submission
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        ForgeForm Comprehensive Demo
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Email */}
        <div>
          <label htmlFor="email">Email:</label>
          <input id="email" {...register("email")} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.email && <span style={{ color: "red" }}>{errors.email.message}</span>}
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input id="fullName" {...register("fullName")} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.fullName && <span style={{ color: "red" }}>{errors.fullName.message}</span>}
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age">Age:</label>
          <input id="age" type="number" {...register("age", { valueAsNumber: true })} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.age && <span style={{ color: "red" }}>{errors.age.message}</span>}
        </div>

        {/* Birth Date */}
        <div>
          <label htmlFor="birthDate">Birth Date:</label>
          <input id="birthDate" type="date" {...register("birthDate")} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.birthDate && <span style={{ color: "red" }}>{errors.birthDate.message}</span>}
        </div>

        {/* Terms (Checkbox) */}
        <div>
          <label htmlFor="terms">Agree to Terms:</label>
          <input id="terms" type="checkbox" {...register("terms")} style={{ marginLeft: "0.5rem" }} />
          {errors.terms && <span style={{ color: "red" }}>{errors.terms.message}</span>}
        </div>

        {/* Gender (Radio) */}
        <div>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label>Gender:</label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label>
              <input type="radio" value="male" {...register("gender")} /> Male
            </label>
            <label>
              <input type="radio" value="female" {...register("gender")} /> Female
            </label>
            <label>
              <input type="radio" value="other" {...register("gender")} /> Other
            </label>
          </div>
          {errors.gender && <span style={{ color: "red" }}>{errors.gender.message}</span>}
        </div>

        {/* Country (Select) */}
        <div>
          <label htmlFor="country">Country:</label>
          <select id="country" {...register("country")} style={{ padding: "0.5rem", width: "100%" }}>
            <option value="">Select a country</option>
            <option value="US">United States</option>
            <option value="IN">India</option>
            <option value="GB">United Kingdom</option>
          </select>
          {errors.country && <span style={{ color: "red" }}>{errors.country.message}</span>}
        </div>

        {/* Address (Object) */}
        <div>
          <h3>Address</h3>
          <div>
            <label htmlFor="address.street">Street:</label>
            <input id="address.street" {...register("address.street")} style={{ padding: "0.5rem", width: "100%" }} />
            {errors.address?.street && <span style={{ color: "red" }}>{errors.address.street.message}</span>}
          </div>
          <div>
            <label htmlFor="address.city">City:</label>
            <input id="address.city" {...register("address.city")} style={{ padding: "0.5rem", width: "100%" }} />
            {errors.address?.city && <span style={{ color: "red" }}>{errors.address.city.message}</span>}
          </div>
          <div>
            <label htmlFor="address.zip">ZIP Code:</label>
            <input id="address.zip" {...register("address.zip")} style={{ padding: "0.5rem", width: "100%" }} />
            {errors.address?.zip && <span style={{ color: "red" }}>{errors.address.zip.message}</span>}
          </div>
        </div>

        {/* Hobbies (Array) */}
        <div>
          <label htmlFor="hobbies">Hobbies (comma-separated):</label>
          <input id="hobbies" {...register("hobbies")} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.hobbies && <span style={{ color: "red" }}>{errors.hobbies.message}</span>}
        </div>

        {/* Custom Field (Custom Validator) */}
        <div>
          <label htmlFor="customField">Custom Field (must be 'foobar'):</label>
          <input id="customField" {...register("customField")} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.customField && <span style={{ color: "red" }}>{errors.customField.message}</span>}
        </div>

        {/* Rating (Float) */}
        <div>
          <label htmlFor="rating">Rating (0-5):</label>
          <input id="rating" type="number" step="0.1" {...register("rating", { valueAsNumber: true })} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.rating && <span style={{ color: "red" }}>{errors.rating.message}</span>}
        </div>

        {/* Colors (Color) */}
        <div>
          <label htmlFor="colors">Favorite Color:</label>
          <input id="colors" type="color" {...register("colors")} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.colors && <span style={{ color: "red" }}>{errors.colors.message}</span>}
        </div>

        {/* Description (Textarea) */}
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" {...register("description")} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.description && <span style={{ color: "red" }}>{errors.description.message}</span>}
        </div>

        {/* Schedule (Datetime-Local) */}
        <div>
          <label htmlFor="schedule">Schedule (Date & Time):</label>
          <input id="schedule" type="datetime-local" {...register("schedule")} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.schedule && <span style={{ color: "red" }}>{errors.schedule.message}</span>}
        </div>

        {/* Union Field (Union: string or number) */}
        <div>
          <label htmlFor="unionField">Union Field (string or number):</label>
          <input id="unionField" {...register("unionField")} style={{ padding: "0.5rem", width: "100%" }} />
          {errors.unionField && <span style={{ color: "red" }}>{errors.unionField.message}</span>}
        </div>

        {/* Tuple Field (Tuple: [string, number]) */}
        <div>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label>Tuple Field:</label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input placeholder="Text" {...register("tupleField.0")} style={{ padding: "0.5rem", flex: 1 }} />
            <input type="number" placeholder="Number" {...register("tupleField.1", { valueAsNumber: true })} style={{ padding: "0.5rem", flex: 1 }} />
          </div>
          {errors.tupleField && <span style={{ color: "red" }}>{errors.tupleField.message}</span>}
        </div>

        {/* Record Field (Record: keys are strings, values are numbers) */}
        {/* <div>
          <label htmlFor="recordField">Record Field (JSON format):</label>
          <textarea id="recordField" {...register("recordField")} placeholder='e.g. { "key1": 1, "key2": 2 }' style={{ padding: "0.5rem", width: "100%" }} />
          {errors.recordField && <span style={{ color: "red" }}>{errors.recordField.message}</span>}
        </div> */}

        <button type="submit" style={{ padding: "0.75rem", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default RHFExample;





// following is the demo for the react-hook-forms with submission 

// import React from "react";
// import { useForm as useRHFForm } from "react-hook-form";
// import { createSchema, forgeFormResolver, buildRegex } from "forgeform";

// interface FormData {
//   email: string;
//   age: number;
// }

// const schema = createSchema<FormData>({
//   fields: {
//     email: {
//       type: "email",
//       required: true,
//       minLength: 5,
//       trim: true,
//       lowercase: true,
//       // Updated email regex requires at least one dot in the domain:
//       pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.source,
//       requiredErrorMessage: "Email is required.",
//     },
//     age: {
//       type: "number",
//       required: true,
//       min: 18,
//       max: 120,
//     },
//   },
// });

// const RHFExample: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useRHFForm<FormData>({
//     resolver: forgeFormResolver(schema),
//   });

//   const onSubmit = (data: FormData) => {
//     console.log("Form Data:", data);
//   };

//   return (
//     <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
//       <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
//         ForgeForm with React Hook Form
//       </h1>
//       <form
//         onSubmit={handleSubmit(onSubmit, (errs) => console.log("Validation Errors:", errs))}
//         style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//       >
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input id="email" {...register("email")} style={{ padding: "0.5rem", width: "100%" }} />
//           {errors.email && <span style={{ color: "red" }}>{errors.email.message}</span>}
//         </div>
//         <div>
//           <label htmlFor="age">Age:</label>
//           <input id="age" type="number" {...register("age", { valueAsNumber: true })} style={{ padding: "0.5rem", width: "100%" }} />
//           {errors.age && <span style={{ color: "red" }}>{errors.age.message}</span>}
//         </div>
//         <button
//           type="submit"
//           style={{
//             padding: "0.75rem",
//             backgroundColor: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//           }}
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RHFExample;
