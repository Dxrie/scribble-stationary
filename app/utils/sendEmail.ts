import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const sendEmail = async (
  userEmail: string,
  subject: string,
  message: string,
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    console.log(transporter);

    const mailOptions = {
      from: {
        name: "Scribble",
        address: process.env.USER,
      },
      to: userEmail,
      subject: subject,
      html: `<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        margin-top: 50px;
      }

      h1 {
        color: #333333;
        text-align: center;
      }

      p {
        color: #666666;
        line-height: 1.5;
      }

      .button {
        display: block;
        margin: 0 auto;
        padding: 10px 20px;
        background-color: #007bff;
        color: black;
        text-decoration: none;
        border-radius: 5px;
        text-align: center; /* Added to center the button */
      }

      .expire-time {
        text-align: center;
        margin-top: 10px;
        color: #999999;
      }

      .button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Verify Your Email Address</h1>
      <p>
        Thank you for signing up! To complete your registration, please click
        the button below to verify your email address.
      </p>
      <a href=${message} class="button">Verify Email</a>
      <p class="expire-time">This link will expire in 30 minutes.</p>
    </div>
  </body>
</html>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return NextResponse.json(
        {
          message: "Something went wrong: " + err.message,
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          message: "An error occured.",
        },
        { status: 500 },
      );
    }
  }
};

export const sendResetPassEmail = async (
  userEmail: string,
  subject: string,
  message: string,
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "Scribble",
        address: process.env.USER,
      },
      to: userEmail,
      subject: subject,
      html: `<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        margin-top: 50px;
      }

      h1 {
        color: #333333;
        text-align: center;
      }

      p {
        color: #666666;
        line-height: 1.5;
      }

      .button {
        display: block;
        margin: 0 auto;
        padding: 10px 20px;
        background-color: #007bff;
        color: black;
        text-decoration: none;
        border-radius: 5px;
        text-align: center; /* Added to center the button */
      }

      .expire-time {
        text-align: center;
        margin-top: 10px;
        color: #999999;
      }

      .button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Change Your Account Password</h1>
      <p>
        Please click the link below to change your password.
      </p>
      <a href=${message} class="button">Change Password</a>
      <p class="expire-time">This link will expire in 30 minutes.</p>
    </div>
  </body>
</html>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return NextResponse.json(
        {
          message: "Something went wrong: " + err.message,
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          message: "An error occured.",
        },
        { status: 500 },
      );
    }
  }
};
