(() => {
  const track = document.getElementById("productsCarouselTrack");
  if (!track) return;

  const prevBtn = document.querySelector(".products-carousel__arrow--prev");
  const nextBtn = document.querySelector(".products-carousel__arrow--next");

  const scrollByCards = (direction) => {
    const card = track.querySelector(".product-card");
    const step = card ? card.getBoundingClientRect().width + 20 : 220;
    track.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  };

  prevBtn?.addEventListener("click", () => scrollByCards(-1));
  nextBtn?.addEventListener("click", () => scrollByCards(1));
})();
