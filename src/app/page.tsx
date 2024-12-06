"use client";
import { Button, Card, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import Chat from "@/components/Chat";
import * as Yup from "yup"; // Import Yup

const Home = () => {
  const [username, setUsername] = useState<string>("");

  const handleJoinChat = (v: any) => {
    console.log(v);
    setUsername(v.username);
  };

  const handleLeaveChat = ()=>{
    setUsername('');
  }

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must not exceed 15 characters")
      .matches(/^(?!\s*$).+/, "Username cannot be empty or just spaces")
      .required("Username is required"),
  });

  return (
    <div className="container d-flex " style={{justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      {!username ? (
        <Card>
          <Typography variant="h3">Welcome</Typography>
          <Formik
            initialValues={{ username: "" }}
            onSubmit={handleJoinChat}
            validationSchema={validationSchema}
            // validateOnChange={true}
          >
            {({ handleChange, handleSubmit, values, touched, errors }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  className="mt-2"
                  name="username"
                  label="Username"
                  variant="outlined"
                  as={TextField}
                  fullWidth
                  value={values.username}
                  onChange={handleChange}
                  // onKeyDown={handleKeyDown}
                  size="small"
                  required
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                />
                <Button style={{width: '100%'}} className="mt-2" type="submit" variant="contained">
                  Join
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      ) : (
        <Chat logout={handleLeaveChat} username={username} />
      )}
    </div>
  );
};

export default Home;
