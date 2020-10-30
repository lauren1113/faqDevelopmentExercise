import links from "../store/Links";
import { User } from "../store";

export default st => `
  <nav id="navBar">
  <div>
    <a id="logInLogOutButton" href="${!User.loggedIn ? "/Login" : "/"}">${
  !User.loggedIn ? "LOG IN" : "LOG OUT"
}</a>
  </div>
    <div id="navBarContainer">
      <h2 id="nav-title">Ashlynn's Arrangements</h2>
      <div id="navButtonsContainer">
      ${links
        .map(
          link =>
            `<button class="navButton"><a href="/${link.title}" data-navigo>${link.text}</a></button>`
        )
        .join("")}
      </div>
    </div>
  </nav>
`;
