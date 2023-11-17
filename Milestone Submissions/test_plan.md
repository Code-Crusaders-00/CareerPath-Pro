# Testing Plan
## Code-Crusader 14-02 Project CareerPath Pro

### Test Cases
- **Test the /login API route:**
  - Test case 1: Verify that the API returns a 200 status code and a success message when valid credentials are provided.
  - Test case 2: Verify that the API returns a 401 status code when invalid credentials are provided.

- **Test the /register API route:**
  - Test case 1: Verify that the API returns a 200 status code and a success message when registration is successful.
  - Test case 2: Verify that the API returns a 400 status code and an error message when registration fails.

- **Test the /users/:userId/job-applications API route:**
  - Test case 1: Verify that the API returns a list of job applications for the specified user.
  - Test case 2: Verify that the API creates a new job application for the specified user.

### Test Data
- For the /login tests, the data being used will check the username and password inputted from the user against our database.
- For the /register tests, the data being used will check if the registration was successful or not.
- For the /users/:userId/job-applications API route, we will check that the job application list returned for a specific user.

### Environment
- In our tests, we are using the testing framework Mocha and the library Chai.

### Test Results
- For the /login tests, we will see that if the data inputted by the user is correct, it returns a 200, and exits; otherwise, it returns 401.
- For the /register tests, we will see if the registration was successful. If it was, it should return a 200; if it wasn't, it returns a 400.
- For the /users/:userId/job-applications API route, we will check to see if the job applications for a specific user are correct. If they are, it returns good; else, it returns an error.

### User Acceptance Testers
- When the user is looking at the website, they should be able to login with no errors.
- They should be able to register with no errors.
- The user should see their correct job applications and be able to add new jobs to the list.
