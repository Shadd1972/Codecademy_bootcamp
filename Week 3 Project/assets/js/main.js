document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const revealables = Array.from(document.querySelectorAll('.card, .section-title, .hero-card'));
  revealables.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealables.forEach(el => io.observe(el));

  // Basic client-side validation styling
  const form = document.querySelector('form');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if(!form.checkValidity()){
        form.classList.add('was-validated');
        return;
      }
      alert('Thanks! Your message has been sent (demo).');
      form.reset();
    });
  }
});
