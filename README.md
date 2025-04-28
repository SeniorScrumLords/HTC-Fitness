# HTC-Fitness

Hyperbolic Time Chamber Fitness (HTC Fitness) is designed to empower users to discover and implement personalized fitness routines suited specifically for their bodies and goals. Users can track their progress, manage sleep schedules, and create healthier lifestyle habits through a comprehensive, user-friendly interface.

# Node Version

Ensure you have Node version 22 installed.

# Setup Instructions

Prerequisites

- API Keys

- API Ninjas (Exercises)

- Google OAuth Client ID and Secret

- Randomly generated session secret (Use Node's crypto module)

- Environment Variables

- Create a .env file following the .env.example provided to store your environment variables.

# Starting the Application

Ensure MongoDB is running locally.

Start the development server:

npm run dev

# Populate sample data (optional):

npm run seed

# Authentication Features

User Authentication

Secure login via Google OAuth.

# Navigation

Intuitive NavBar with easy access to all app features and logout functionality.

# Home Page (Dashboard)
- Customizable Dashboard

- Users have the option to add or delete features from their homepage and change the name that appears in the welcome banner.

- Interactive buttons to explore various exercises.

- Informative exercise cards displaying details and the option to add exercises to your routines.

# Goals Tracking

- Set, view, or remove goal weight.

- Add daily or retrospective weight entries.

- Interactive progress charts.

# Tips Popup
- These are Dragon Ball Z themed workout tips based on gender and an intensity scale going through 1 through 7.

- When logging into HTC-Fitness the default gender is set to male, to change it go to the Profile section in the nav bar. Select female and refresh the page and you will see the female tips popup.

- If you go through all the intensities and want to reset it to one, go to the Profile section and select reset tips.

- If you want to completely delete the tips popup feature select Delete Tips to completely disable tips, If you change your mind and want to bring them back hit the Rest Tips button in the profile section.

# Routines Management

- Customize exercise routines from the homepage
- with adjustable reps
- body part worked on
- a weight lifted tracker
- ability to set set amount

# Reminder Card
- The ReminderCard component is designed to allow users to manage their reminders.
- It handles operations like creating, editing, deleting, and marking reminders as completed.
- It  allows users to add the title of reminder, the description,and pick a date and time for their reminder.
- Once many reminders are created, the user is able to scroll through all reminders.
- The user can delete the reminder with the ability to confirm the delete.
- The user is able to edit all or cancel the edit.
- The user is able to mark the reminder complete.

# Sleep Tracker

- Track sleep duration with a convenient timer feature.
- Adjusted timing system accounting for practical bedtime routines.
- Set personalized sleep goals and record sleep quality, disturbances, and aids used.
- Sleep sessions automatically rated based on goal alignment.
- Environment Management: dotenv

# Original Repo Contributors
  - Adonijah Johnson Jr [Github](https://github.com/AJ-Gamer)
  - Dakota Day [Github](https://github.com/Mothroom)

# Legacy March 2025 Contributors
- Charles Sublett: Product Owner [TipsPopup] [Github] (https://github.com/BMH397)

- Mary Alice: Scrum Master [Settings] [Github] (https://github.com/malicesand)

- Peyton Strahan: Scrum Master [SleepTracker] [Github] (https://github.com/PeytonStrahan)

- Whitley Legard Antoine [Reminders] [Github] (https://github.com/Wlegard)

- Jay Shanks [Routines] [Github] (https://github.com/taytay836)

Thank you for contributing to making HTC Fitness better for everyone!

# Tech Stack
  - Api: API Ninjas [Docs](https://api-ninjas.com/api/exercises)
  - Frontend: React [Docs](https://react.dev/)
  - Backend: Express [Docs](https://expressjs.com/en/4x/api.html)
  - Build: Webpack [Config Docs](https://webpack.js.org/configuration/)
  - Database: MongoDB & Mongoose [Docs](https://mongoosejs.com/)
  - Deployment: AWS [Make An Account Here](https://aws.amazon.com/free/?gclid=Cj0KCQjw8--2BhCHARIsAF_w1gxqy2n-xVXx_xy7dM4sYBu7QCjL7IfB_oLIrqY4XcT9CJ9VAIbVKbIaAlnlEALw_wcB&trk=7541ebd3-552d-4f98-9357-b542436aa66c&sc_channel=ps&ef_id=Cj0KCQjw8--2BhCHARIsAF_w1gxqy2n-xVXx_xy7dM4sYBu7QCjL7IfB_oLIrqY4XcT9CJ9VAIbVKbIaAlnlEALw_wcB:G:s&s_kwcid=AL!4422!3!651751058796!e!!g!!aws%20console!19852662149!145019243977&all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all)
  - Auth: Passport [Docs](https://www.passportjs.org/tutorials/google/)
  - Styling: Material UI [Component Docs](https://mui.com/), [Chart Docs](https://mui.com/x/react-charts/)
  - Environment Variables: dotenv [Docs](https://www.npmjs.com/package/dotenv)

# Known Bugs
  - Navigated pages do not render after the browser page refreshes.
  - Changing (patching) a sleep record via the "Time Slept" property doesn't update the value gotten from Master Timer due to the Master Timer only utilizing the start date and end date of the sleep record. (Best course of action may be to remove or alter the method of the ability to alter the hours_slept property via. patch requests)
  - Tips pop up gender's automatically set to male by default
  - When going down in intensity, you have to go to the profile page and select the drop down (select the number you want) and refresh the page