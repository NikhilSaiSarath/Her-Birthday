document.addEventListener("DOMContentLoaded", () => {

    /* ELEMENTS */

    const beginBtn = document.getElementById("beginBtn");
    const loveBtn = document.getElementById("loveBtn");
    const surpriseOverlay = document.getElementById("surpriseOverlay");
    const closeBtn = document.getElementById("closeBtn");
    const floatingHearts = document.querySelector(".floating-hearts");

    const birthdaySection = document.getElementById("birthday");


    /* REDUCED MOTION */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* BEGIN BUTTON */

    if (beginBtn && birthdaySection) {

        beginBtn.addEventListener("click", () => {

            birthdaySection.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth"
            });

            createHeartBurst(
                window.innerWidth / 2,
                window.innerHeight * 0.75,
                8
            );
        });

    }


    /* SCROLL REVEAL */

    const revealElements = document.querySelectorAll(
        ".section-inner, .letter-container, .wish-content, .final-content, .reason-card, .moment, .letter-card"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });


    if (!reducedMotion && "IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px"
            }
        );


        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    /* FLOATING HEARTS */

    function createFloatingHeart() {

        if (!floatingHearts) return;

        const heart = document.createElement("span");

        heart.classList.add("floating-heart");

        const heartSymbols = [
            "♡",
            "♥",
            "❤",
            "✦",
            "⋆"
        ];

        heart.textContent =
            heartSymbols[
                Math.floor(Math.random() * heartSymbols.length)
            ];

        heart.style.left = `${Math.random() * 100}%`;

        const size = 10 + Math.random() * 18;

        heart.style.fontSize = `${size}px`;

        const duration = 8 + Math.random() * 8;

        heart.style.animationDuration = `${duration}s`;

        heart.style.animationDelay = `${Math.random() * 1.5}s`;

        floatingHearts.appendChild(heart);


        setTimeout(() => {
            heart.remove();
        }, (duration + 2) * 1000);

    }


    if (!reducedMotion) {

        // Start with a few hearts
        for (let i = 0; i < 7; i++) {

            setTimeout(() => {
                createFloatingHeart();
            }, i * 700);

        }


        // Continue creating hearts
        setInterval(() => {

            createFloatingHeart();

        }, 1800);

    }


    /* HEART BURST */

    function createHeartBurst(x, y, amount = 15) {

        if (reducedMotion || !floatingHearts) return;


        for (let i = 0; i < amount; i++) {

            const heart = document.createElement("span");

            heart.classList.add("floating-heart");

            heart.textContent =
                Math.random() > 0.3 ? "♥" : "♡";

            heart.style.left = `${x}px`;

            heart.style.bottom = "auto";

            heart.style.top = `${y}px`;

            heart.style.fontSize =
                `${12 + Math.random() * 18}px`;

            heart.style.animationDuration =
                `${2 + Math.random() * 2}s`;


            const direction =
                (Math.random() - 0.5) * 250;

            const distance =
                120 + Math.random() * 250;


            heart.animate(
                [
                    {
                        transform: "translate(0, 0) scale(0.5)",
                        opacity: 0
                    },
                    {
                        transform:
                            `translate(${direction * 0.3}px, -${distance * 0.35}px) scale(1)`,
                        opacity: 0.9
                    },
                    {
                        transform:
                            `translate(${direction}px, -${distance}px) scale(1.2)`,
                        opacity: 0
                    }
                ],
                {
                    duration: 1800 + Math.random() * 1000,
                    easing: "cubic-bezier(.2,.8,.3,1)"
                }
            );


            floatingHearts.appendChild(heart);


            setTimeout(() => {
                heart.remove();
            }, 3000);

        }

    }


    /* REASON CARD INTERACTION */

    const reasonCards =
        document.querySelectorAll(".reason-card");


    reasonCards.forEach((card) => {

        card.addEventListener("mouseenter", () => {

            if (reducedMotion) return;

            card.style.transform =
                "translateY(-10px) scale(1.015)";

        });


        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });


        // Mobile / touch interaction
        card.addEventListener("click", () => {

            if (reducedMotion) return;

            card.classList.toggle("card-active");

        });

    });


    /* Surprise — OPEN */

    function openSurprise() {

        if (!surpriseOverlay) return;

        surpriseOverlay.classList.add("active");

        document.body.style.overflow = "hidden";


        // Small heart explosion
        createHeartBurst(
            window.innerWidth / 2,
            window.innerHeight / 2,
            22
        );


        // Focus close button for accessibility
        if (closeBtn) {

            setTimeout(() => {
                closeBtn.focus();
            }, 300);

        }

    }


    /* Surprise — CLOSE */

    function closeSurprise() {

        if (!surpriseOverlay) return;

        surpriseOverlay.classList.remove("active");

        document.body.style.overflow = "";

    }


    /* LOVE BUTTON */

    if (loveBtn) {

        loveBtn.addEventListener("click", () => {

            openSurprise();

        });

    }


    /* CLOSE BUTTON */

    if (closeBtn) {

        closeBtn.addEventListener("click", () => {

            closeSurprise();

        });

    }


    /* CLICK OUTSIDE Surprise */

    if (surpriseOverlay) {

        surpriseOverlay.addEventListener("click", (event) => {

            if (event.target === surpriseOverlay) {

                closeSurprise();

            }

        });

    }


    /* ESCAPE KEY*/

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            surpriseOverlay &&
            surpriseOverlay.classList.contains("active")
        ) {

            closeSurprise();

        }

    });


    /* OPTIONAL BACKGROUND MUSIC */

    const backgroundMusic =
        document.getElementById("backgroundMusic");


    if (backgroundMusic) {

        backgroundMusic.volume = 0.35;


        // Try starting music after the first interaction
        const startMusic = () => {

            backgroundMusic.play().catch(() => {
                // Browser may still block autoplay.
            });

        };


        document.addEventListener(
            "click",
            startMusic,
            { once: true }
        );

    }


    /* ACTIVE MOMENT EFFECT */

    const moments =
        document.querySelectorAll(".moment");


    moments.forEach((moment) => {

        moment.addEventListener("click", () => {

            if (reducedMotion) return;

            moment.animate(
                [
                    {
                        transform: "translateX(0)"
                    },
                    {
                        transform: "translateX(8px)"
                    },
                    {
                        transform: "translateX(0)"
                    }
                ],
                {
                    duration: 450,
                    easing: "ease-out"
                }
            );

        });

    });


    /* PARALLAX-STYLE HERO EFFECT */

    const heroContent =
        document.querySelector(".hero-content");


    if (
        heroContent &&
        !reducedMotion &&
        window.innerWidth > 700
    ) {

        window.addEventListener(
            "scroll",
            () => {

                const scrollY = window.scrollY;

                if (scrollY < window.innerHeight) {

                    const opacity =
                        Math.max(
                            0,
                            1 - scrollY / 500
                        );

                    const translate =
                        Math.min(
                            scrollY * 0.18,
                            80
                        );

                    heroContent.style.transform =
                        `translateY(${translate}px)`;

                    heroContent.style.opacity =
                        opacity;

                }

            },
            { passive: true }
        );

    }


    /* PREVENT ACCIDENTAL FOCUS BEHIND Surprise */

    if (surpriseOverlay) {

        surpriseOverlay.addEventListener(
            "transitionend",
            () => {

                if (
                    !surpriseOverlay.classList.contains("active")
                ) {

                    document.body.style.overflow = "";

                }

            }
        );

    }


    /* CONSOLE MESSAGE */

    console.log(
        "%cMade with love ❤️",
        "font-size: 18px; color: #e9a1b5;"
    );

});