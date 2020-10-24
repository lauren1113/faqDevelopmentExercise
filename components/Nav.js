export default links => `
  <nav id="navBar">
    <div id="navBarContainer">
      <h2 id="nav-title">Ashlynn's Arrangements</h2>
      <div id="navButtonsContainer">
      ${links.map(link => `<button class="navButton"><a href="/${link.title}" data-navigo>${link.text}</a></button>`).join("")}
      </div>
    </div>
  </nav>
`;
