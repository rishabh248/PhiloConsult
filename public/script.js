document.addEventListener("DOMContentLoaded", function () {
    // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
        lerp: 0.08, // Smoothness (Lower value = more smooth)
    });
  
    // Fix resizing issue
    window.addEventListener("resize", () => {
        scroll.update();
    });
  
    // Small cursor animation
    var crsr = document.querySelector("#minicircle");
    window.addEventListener("mousemove", function (e) {
        gsap.to(crsr, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power1.out"
        });
    });
  
    // First Page Animation
    function firstPageAnim() {
        var tl = gsap.timeline();
  
        tl.from("#nav", {
            y: "-10",
            opacity: 0,
            duration: 1.2,
            ease: Expo.easeInOut,
        })
        .to(".boundingelem", {
            y: 0,
            ease: Expo.easeInOut,
            duration: 1.8,
            delay: -1,
            stagger: 0.2,
        })
        .from("#herofooter", {
            y: -10,
            opacity: 0,
            duration: 1.2,
            delay: -1,
            ease: Expo.easeInOut,
        });
    }
  
    firstPageAnim();
  
    // Smooth Menu Toggle Animation with Overlay Fix
    const menuToggle = document.getElementById("menu-toggle");
    const menuOverlay = document.getElementById("menu-overlay");
    const body = document.body;
  
    let menuOpen = false;
  
    menuToggle.addEventListener("click", function () {
        if (!menuOpen) {
            gsap.to(menuOverlay, { y: "0%", duration: 0.5, ease: "expo.out" });
            body.classList.add("menu-open"); // Hide background text
            document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
            gsap.to(menuOverlay, { y: "-100%", duration: 0.5, ease: "expo.out" });
            body.classList.remove("menu-open"); // Show background text
            document.body.style.overflow = "auto"; // Enable scrolling
        }
        menuOpen = !menuOpen;
    });
  });
  