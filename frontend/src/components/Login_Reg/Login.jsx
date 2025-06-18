import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom"; // ✅ import it here

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const Login = () => {
  const navigate = useNavigate(); // ✅ initialize here

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // Simulate login and redirect to quiz
    alert("Login successful!");
    navigate("/select-subject");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        <button type="submit" className="btn">Login</button>
      </form>

      {/* ✅ Add this button to go to /results */}
      <button
        onClick={() => navigate("/results")}
        className="btn"
        style={{ marginTop: "20px", backgroundColor: "#888" }}
      >
        View Quiz Results
      </button>
    </div>
  );
};

export default Login;
