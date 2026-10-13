/* ==========================================================================
   HARSH TRIPATHI PORTFOLIO — Main JavaScript
   Includes: Loader, WebGL Line Waves, Particles.js, GSAP ScrollTrigger,
   Scroll Progress Bar, Dark/Light Theme Toggle, GitHub API, Contact Form
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------------
     1. DARK / LIGHT THEME SWITCHER
     ------------------------------------------------------------------------ */
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("harsh-portfolio-theme") || "dark";
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("harsh-portfolio-theme", theme);
    if (themeIcon) {
      themeIcon.className =
        theme === "dark" ? "fas fa-sun text-sm" : "fas fa-moon text-sm";
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ------------------------------------------------------------------------
     2. MOBILE MENU & ACTIVE NAV LINKS
     ------------------------------------------------------------------------ */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
  }

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".site-navbar .nav-link");

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 140;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. RIGHT-SIDE VERTICAL SCROLL PROGRESS BAR & BACK TO TOP
     ------------------------------------------------------------------------ */
  const progressBar = document.getElementById("scroll-indicator");
  const scrollBar = document.getElementById("scroll-bar");
  const backToTopButton = document.getElementById("backToTop");
  let ticking = false;

  function onScrollUpdate() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.height = `${scrollPercent}%`;
    }

    if (backToTopButton) {
      if (scrollTop > 300) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    }

    highlightActiveNav();
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollUpdate);
      ticking = true;
    }
  });

  if (scrollBar) {
    scrollBar.addEventListener("click", (e) => {
      const rect = scrollBar.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const percent = clickY / rect.height;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: percent * docHeight,
        behavior: "smooth",
      });
    });
  }

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------------
     4. LOADING ANIMATION (H A R S H) & GSAP ANIMATIONS
     ------------------------------------------------------------------------ */
  const loadingOverlay = document.getElementById("loading");
  const letters = document.querySelectorAll(".loading-text span");

  if (typeof gsap !== "undefined" && letters.length > 0 && loadingOverlay) {
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.to(letters, {
      opacity: 1,
      duration: 0.9,
      stagger: 0.12,
      onStart: () => {
        letters.forEach((el, i) => {
          gsap.to(el, {
            color: "#ffffff",
            duration: 0.2,
            delay: i * 0.12,
          });
          gsap.to(el, {
            color: "#1DCD9F",
            duration: 0.25,
            delay: i * 0.12 + 0.3,
          });
        });
      },
      onComplete: () => {
        gsap.to("#loading", {
          opacity: 0,
          duration: 0.65,
          delay: 0.25,
          onComplete: () => {
            loadingOverlay.style.display = "none";
          },
        });
      },
    });

    // Hero Entrance
    gsap.from(".hero-left", {
      opacity: 0,
      x: -50,
      duration: 1.1,
      delay: 0.9,
      ease: "power3.out",
    });

    gsap.from(".hero-right", {
      opacity: 0,
      x: 50,
      duration: 1.1,
      delay: 1.1,
      ease: "power3.out",
    });

    // ScrollTrigger Cards Reveal
    if (typeof ScrollTrigger !== "undefined") {
      gsap.utils
        .toArray(".journey-card, .project-card, .edu-card, .cert-card")
        .forEach((card, index) => {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            delay: (index % 3) * 0.08,
          });
        });
    }
  } else if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.style.display = "none";
    }, 600);
  }

  /* ------------------------------------------------------------------------
     5. HERO WEBGL LINE WAVES SHADER BACKGROUND
     ------------------------------------------------------------------------ */
  function initLineWaves(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const {
      speed = 0.3,
      innerLineCount = 32.0,
      outerLineCount = 36.0,
      warpIntensity = 1.0,
      rotation = -45,
      edgeFadeWidth = 0.0,
      colorCycleSpeed = 1.0,
      brightness = 0.2,
      color1 = "#1DCD9F",
      color2 = "#1DCD9F",
      color3 = "#1DCD9F",
      enableMouseInteraction = true,
      mouseInfluence = 2.0,
    } = options;

    function hexToVec3(hex) {
      const h = hex.replace("#", "");
      return [
        parseInt(h.slice(0, 2), 16) / 255,
        parseInt(h.slice(2, 4), 16) / 255,
        parseInt(h.slice(4, 6), 16) / 255,
      ];
    }

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;display:block;";
    container.appendChild(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vertexShaderSrc = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uSpeed;
      uniform float uInnerLines;
      uniform float uOuterLines;
      uniform float uWarpIntensity;
      uniform float uRotation;
      uniform float uEdgeFadeWidth;
      uniform float uColorCycleSpeed;
      uniform float uBrightness;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec2 uMouse;
      uniform float uMouseInfluence;
      uniform bool uEnableMouse;

      #define HALF_PI 1.5707963

      float hashF(float n) {
        return fract(sin(n * 127.1) * 43758.5453123);
      }

      float smoothNoise(float x) {
        float i = floor(x);
        float f = fract(x);
        float u = f * f * (3.0 - 2.0 * f);
        return mix(hashF(i), hashF(i + 1.0), u);
      }

      float displaceA(float coord, float t) {
        float result = sin(coord * 2.123) * 0.2;
        result += sin(coord * 3.234 + t * 4.345) * 0.1;
        result += sin(coord * 0.589 + t * 0.934) * 0.5;
        return result;
      }

      float displaceB(float coord, float t) {
        float result = sin(coord * 1.345) * 0.3;
        result += sin(coord * 2.734 + t * 3.345) * 0.2;
        result += sin(coord * 0.189 + t * 0.934) * 0.3;
        return result;
      }

      vec2 rotate2D(vec2 p, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
      }

      void main() {
        vec2 coords = gl_FragCoord.xy / uResolution;
        coords = coords * 2.0 - 1.0;
        coords.x *= uResolution.x / uResolution.y;
        coords = rotate2D(coords, uRotation);

        float halfT = uTime * uSpeed * 0.5;
        float fullT = uTime * uSpeed;

        float mouseWarp = 0.0;
        if (uEnableMouse) {
          vec2 mPos = rotate2D(uMouse * 2.0 - 1.0, uRotation);
          mPos.x *= uResolution.x / uResolution.y;
          float mDist = length(coords - mPos);
          mouseWarp = uMouseInfluence * exp(-mDist * mDist * 4.0);
        }

        float warpAx = coords.x + displaceA(coords.y, halfT) * uWarpIntensity + mouseWarp;
        float warpAy = coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarpIntensity;
        float warpBx = coords.x + displaceB(coords.y, halfT) * uWarpIntensity + mouseWarp;
        float warpBy = coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarpIntensity;

        vec2 fieldA = vec2(warpAx, warpAy);
        vec2 fieldB = vec2(warpBx, warpBy);
        vec2 blended = mix(fieldA, fieldB, mix(fieldA, fieldB, 0.5));

        float fadeTop = smoothstep(uEdgeFadeWidth, uEdgeFadeWidth + 0.4, blended.y);
        float fadeBottom = smoothstep(-uEdgeFadeWidth, -(uEdgeFadeWidth + 0.4), blended.y);
        float vMask = 1.0 - max(fadeTop, fadeBottom);

        float tileCount = mix(uOuterLines, uInnerLines, vMask);
        float scaledY = blended.y * tileCount;
        float nY = smoothNoise(abs(scaledY));

        float ridge = pow(
          step(abs(nY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (nY - blended.x)),
          5.0
        );

        float lines = 0.0;
        for (float i = 1.0; i < 3.0; i += 1.0) {
          lines += pow(max(fract(scaledY), fract(-scaledY)), i * 2.0);
        }

        float pattern = vMask * lines;

        float cycleT = fullT * uColorCycleSpeed;
        float rChannel = (pattern + lines * ridge) * (cos(blended.y + cycleT * 0.234) * 0.5 + 1.0);
        float gChannel = (pattern + vMask * ridge) * (sin(blended.x + cycleT * 1.745) * 0.5 + 1.0);
        float bChannel = (pattern + lines * ridge) * (cos(blended.x + cycleT * 0.534) * 0.5 + 1.0);

        vec3 col = (rChannel * uColor1 + gChannel * uColor2 + bChannel * uColor3) * uBrightness;
        float alpha = clamp(length(col), 0.0, 1.0);

        gl_FragColor = vec4(col, alpha);
      }
    `;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSrc);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const quadVerts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uResLoc = gl.getUniformLocation(program, "uResolution");
    const uSpeedLoc = gl.getUniformLocation(program, "uSpeed");
    const uInnerLoc = gl.getUniformLocation(program, "uInnerLines");
    const uOuterLoc = gl.getUniformLocation(program, "uOuterLines");
    const uWarpLoc = gl.getUniformLocation(program, "uWarpIntensity");
    const uRotLoc = gl.getUniformLocation(program, "uRotation");
    const uFadeLoc = gl.getUniformLocation(program, "uEdgeFadeWidth");
    const uCycleLoc = gl.getUniformLocation(program, "uColorCycleSpeed");
    const uBrightLoc = gl.getUniformLocation(program, "uBrightness");
    const uC1Loc = gl.getUniformLocation(program, "uColor1");
    const uC2Loc = gl.getUniformLocation(program, "uColor2");
    const uC3Loc = gl.getUniformLocation(program, "uColor3");
    const uMouseLoc = gl.getUniformLocation(program, "uMouse");
    const uMouseInfLoc = gl.getUniformLocation(program, "uMouseInfluence");
    const uEnableMouseLoc = gl.getUniformLocation(program, "uEnableMouse");

    const rotRad = (rotation * Math.PI) / 180;
    gl.uniform1f(uSpeedLoc, speed);
    gl.uniform1f(uInnerLoc, innerLineCount);
    gl.uniform1f(uOuterLoc, outerLineCount);
    gl.uniform1f(uWarpLoc, warpIntensity);
    gl.uniform1f(uRotLoc, rotRad);
    gl.uniform1f(uFadeLoc, edgeFadeWidth);
    gl.uniform1f(uCycleLoc, colorCycleSpeed);
    gl.uniform1f(uBrightLoc, brightness);
    gl.uniform3fv(uC1Loc, hexToVec3(color1));
    gl.uniform3fv(uC2Loc, hexToVec3(color2));
    gl.uniform3fv(uC3Loc, hexToVec3(color3));
    gl.uniform1f(uMouseInfLoc, mouseInfluence);
    gl.uniform1i(uEnableMouseLoc, enableMouseInteraction ? 1 : 0);

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetMouse = [
          (e.clientX - rect.left) / rect.width,
          1.0 - (e.clientY - rect.top) / rect.height,
        ];
      }
    });

    function resize() {
      const w =
        container.clientWidth || container.offsetWidth || window.innerWidth;
      const h =
        container.clientHeight || container.offsetHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResLoc, w, h);
    }

    window.addEventListener("resize", resize);

    function render(time) {
      requestAnimationFrame(render);
      gl.uniform1f(uTimeLoc, time * 0.001);
      currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
      currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
      gl.uniform2f(uMouseLoc, currentMouse[0], currentMouse[1]);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    requestAnimationFrame(() => {
      resize();
      requestAnimationFrame(render);
    });
  }

  initLineWaves("line-waves-container", {
    speed: 0.3,
    innerLineCount: 32,
    outerLineCount: 36,
    warpIntensity: 1.0,
    rotation: -45,
    brightness: 0.2,
    color1: "#1DCD9F",
    color2: "#1DCD9F",
    color3: "#1DCD9F",
    enableMouseInteraction: true,
    mouseInfluence: 2.0,
  });

  /* ------------------------------------------------------------------------
     6. PARTICLES.JS IN PROJECTS SECTION
     ------------------------------------------------------------------------ */
  if (
    typeof particlesJS !== "undefined" &&
    document.getElementById("particles-projects")
  ) {
    particlesJS("particles-projects", {
      particles: {
        number: { value: 45 },
        color: { value: "#1DCD9F" },
        shape: { type: "circle" },
        opacity: { value: 0.25 },
        size: { value: 3 },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#1DCD9F",
          opacity: 0.15,
          width: 1,
        },
        move: { enable: true, speed: 1.4 },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
        },
      },
      retina_detect: true,
    });
  }

  /* ------------------------------------------------------------------------
     7. LIVE GITHUB STATS FOR @sahilihas
     ------------------------------------------------------------------------ */
  async function loadGitHubStats() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch("https://api.github.com/users/sahilihas"),
        fetch("https://api.github.com/users/sahilihas/repos?per_page=100"),
      ]);
      if (userRes.ok && reposRes.ok) {
        const user = await userRes.json();
        const repos = await reposRes.json();
        const stars = Array.isArray(repos)
          ? repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
          : 0;

        const reposEl = document.getElementById("githubRepos");
        const starsEl = document.getElementById("githubStars");
        const followersEl = document.getElementById("githubFollowers");

        if (reposEl && user.public_repos !== undefined)
          reposEl.textContent = user.public_repos;
        if (starsEl) starsEl.textContent = stars;
        if (followersEl && user.followers !== undefined)
          followersEl.textContent = user.followers;
      }
    } catch (_) {
      // Keep clean default values on rate-limit or offline
    }
  }
  loadGitHubStats();

  /* ------------------------------------------------------------------------
     8. CONTACT FORM HANDLER
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("senderName")?.value.trim() || "";
      const email = document.getElementById("senderEmail")?.value.trim() || "";
      const subject =
        document.getElementById("senderSubject")?.value.trim() ||
        "Portfolio Inquiry";
      const message =
        document.getElementById("senderMessage")?.value.trim() || "";

      const mailtoLink = `mailto:harsh21tripathi@gmail.com?subject=${encodeURIComponent(
        `${subject} — from ${name}`
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;
      window.location.href = mailtoLink;
    });
  }
});
