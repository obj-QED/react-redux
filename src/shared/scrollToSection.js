export const scrollToSection = (section, offset) => {
  let match = document.querySelector(section);
  if (match) {
    const yOffset = offset || 0;
    const elementTop = match.getBoundingClientRect().top + window.pageYOffset;
    if (elementTop > 200) {
      window.scroll({
        top: elementTop - yOffset,
        behavior: 'auto',
      });
    }
  }
};
