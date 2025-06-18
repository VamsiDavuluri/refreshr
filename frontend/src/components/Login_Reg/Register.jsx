import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
}); // schemas -> utils/ helper folder -> registerSchema.jsx import in the top level

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    alert("Account created successfully!");
    navigate("/"); // use redirect from react-router-dom -> if navigate -> use replace: true
  };
  // use red color for errors messages and dont put in p, try to put in span line - 34
  return (
    <div className="login-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>
        <button type="submit" className="btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
