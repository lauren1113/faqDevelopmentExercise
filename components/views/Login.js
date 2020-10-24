export default () => `
  <div class="loginPageContainer">
  <div class="signInSection" id="existingUserContainer">
    <p class="signInHeading">Sign In</p>
    <form class="signInForm" id="existingUserForm">
      <label for="email">Email: </label>
      <input type="email" name="email" class="signInField" placeholder="enter your email">
      <br>
      <label for="password">Password: </label>
      <input type="password" name="password" class="signInField" placeholder="enter your password">
      <br>
      <br>
      <input type="submit" class="submitButton-signIn" id="sign-in-button" value="Sign In">
    </form>
    <br>
    <img id="signInFormImg" src="https://github.com/lauren1113/faqDevelopmentExercise/blob/master/Images/cropped-bouquet.jpg?raw=true"/>
  </div>

  <img id="loginPageImg" src="https://github.com/lauren1113/faqDevelopmentExercise/blob/master/Images/cropped-vase.jpg?raw=true"/>

  <div class="signInSection" id="register">
    <p class="signInHeading">Create An Account</p>
    <form class="signInForm" id = "newUserForm">
      <label for="firstName">First Name: </label>
      <input type="text" name="firstName" id="firstName" class="signInField" placeholder="First Name">
      <br>
      <label for="lastName">Last Name: </label>
      <input type="text" name="lastName" id="lastName" class="signInField" placeholder="Last Name">
      <br>
      <label for="email">Email: </label>
      <input type="email" name="email" class="signInField" placeholder="enter your email">
      <br>
      <label for="password">Password: </label>
      <input type="password" name="password" class="signInField" placeholder="create a password">
      <br>
      <br>
      <input type="submit" class="submitButton-signIn" id="register-button" value="Create Account">
    </form>
    <br>
  </div>
  </div>
  </div>
`;
