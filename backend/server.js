require('dotenv').config();
console.log(process.env.MONGODB_URI);
const router = require('express').Router();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
const bodyParser = require('body-parser'); 
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'dbbdjhajhwandbs';

const { OAuth2Client } = require('google-auth-library');
const googleClientId = '644888739422-7h961dko8206o73r73c225d3kgcqbdgi.apps.googleusercontent.com';
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = 'aaf9f5b909db9c8db1fca8d1c359b61c4a8cb3c77fd1f8a2fec871679e489110@group.calendar.google.com';
const client = new OAuth2Client(googleClientId);
const dotenv = require('dotenv');

dotenv.config();

const token = jwt.sign({ userId: User._id }, JWT_SECRET, { expiresIn: '1h' });


const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  scopes: SCOPES,
  subject: process.env.GOOGLE_SERVICE_ACCOUNT_SUBJECT,
});

const calendar = google.calendar({ version: 'v3', auth });

const createCalendarEvent = async (userName, userEmail) => {
  const event = {
    summary: `${userName} Login Event`,
    description: 'This event is created when a user logs in.',
    start: {
      dateTime: new Date().toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(Date.now() + 600000).toISOString(), // 10 minutes later
      timeZone: 'Asia/Kolkata',
    },
    attendees: [{ email: userEmail }],
  };

  try {
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });
    console.log('Calendar event created:', response.data.htmlLink);
  } catch (error) {
    console.error('Error creating calendar event:', error);
  }
};



// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies



// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization || req.body.token;
  
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
  
      // Token is valid, you can access the decoded payload
      req.user = decoded;
      next();
    });
  };


  app.post('/checkGoogleUser', async (req, res) => {
    try {
      const { googleId } = req.body;
      const user = await User.findOne({ googleId });
      if (user) {
        console.log('created user already')

        res.status(200).json({ message: 'User exists' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error checking user', error: error.message });
    }
  });

  app.post('/createGoogleUser', async (req, res) => {
    try {
      const { googleId, name, email } = req.body;
      const user = new User({ googleId, name, email, password: 'google_user_password' });
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      user.token = token;
      await user.save();
      console.log('created successfully')
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  });

  app.post('/googleLogin', async (req, res) => {
    try {
      const { googleIdToken } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: googleIdToken,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();
      const googleId = payload['sub'];
      const user = await User.findOne({ googleId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      user.token = token;
      await user.save();
      res.status(200).json({ message: 'Login successful', user, token });
      await createCalendarEvent(user.name, user.email);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  });

// Signup API endpoint
app.post('/signup', async (req, res) => {
  try {
    // Destructure the data from request body
    const { email, name, password } = req.body; 
  
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const googleId = `traditional_${Date.now()}`;
    const user = new User({ email,name, password:hashedPassword,googleId, });
    await user.save();

   
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

  // login API endpoint
app.post('/login', async (req, res) => {
    try {
        
        const { email, password } = req.body;
        console.log('Attempting to log in with email:', email);

        
        const user = await User.findOne({ email });
        console.log('User found:', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

      
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        
        res.status(200).json({ message: 'Login successful', user });
        await createCalendarEvent(user.name, user.email);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.get('/postlogin', verifyToken, (req, res) => {
  // This route is now protected by the verifyToken middleware
  // You can access the authenticated user's information from req.user
  res.json({ message: 'Welcome to the post-login area!', user: req.user });
});

app.post('/logout', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the user's token from the database
    user.token = null;
    await user.save();
    console.log('logout successful')

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
});

const generateOTP = () => {
  // Generate a 6-digit random number
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};



const sendOTPEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: email, // List of receivers
    subject: 'Password Reset OTP', // Subject line
    text: `Your OTP for password reset is: ${otp}`, // Plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a 4-digit OTP
    const otp = generateOTP();

    // Store the OTP in the user document (or any other suitable place)
    user.otp = otp;
    await user.save();

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send the reset email with the OTP
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset Request',
      text: `You have requested a password reset. Please enter the following OTP: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



app.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the user exists in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    console.log('success2');

    // OTP verification successful, proceed with the desired action (e.g., reset password)
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);a
    res.status(500).json({ error: 'Server error' });
  }
});

const generateResetToken = (email, userId) => {
  const payload = {
    email,
    userId,
    // Include any other relevant data
  };

  const options = {
    expiresIn: '1h', // Set the token expiration time
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

app.post('/generate-reset-token', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a reset token
    const resetToken = generateResetToken(email, user._id); // Pass the user ID as well

    // Save the reset token in the user document
    user.resetToken = resetToken;
    await user.save();

    res.status(200).json({ success: true, token: resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Resend OTP endpoint
app.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate a new OTP and set a new expiry time
  const newOtp = generateOTP();
  const newExpiryTime = new Date(new Date().getTime() + 5 * 60000); // 5 minutes for new OTP validity

  user.otp = newOtp;
  user.otpExpiry = newExpiryTime;
  await user.save();

  // Resend OTP to user's email
  sendOTPEmail(email, newOtp);

  res.json({ message: 'OTP resent successfully' });
});

app.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the reset token and get the user ID from the payload
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Find the user by ID and update their password
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and remove the resetToken
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
