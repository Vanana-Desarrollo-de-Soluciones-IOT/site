(function () {
    var T = {};
    var currentLang = localStorage.getItem("clair_lang") || "en";

    function t(key) {
        var parts = key.split(".");
        var val = T[currentLang];
        for (var i = 0; i < parts.length; i++) {
            if (val == null) return key;
            val = val[parts[i]];
        }
        return val != null ? val : key;
    }

    function applyTranslations() {
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            el.textContent = t(el.getAttribute("data-i18n"));
        });
        document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
            el.innerHTML = t(el.getAttribute("data-i18n-html"));
        });
        document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
            el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
        });
        document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
            el.setAttribute("alt", t(el.getAttribute("data-i18n-alt")));
        });
        document.documentElement.lang = currentLang;
        document.querySelectorAll(".lang-option").forEach(function (btn) {
            btn.classList.toggle("lang-option--active", btn.getAttribute("data-lang") === currentLang);
        });
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem("clair_lang", lang);
        if (T[lang]) {
            applyTranslations();
        } else {
            loadLocale(lang, applyTranslations);
        }
    }

    function loadLocale(lang, callback) {
        fetch("i18n/" + lang + ".json")
            .then(function (res) { return res.json(); })
            .then(function (data) {
                T[lang] = data;
                if (callback) callback();
            });
    }

    // ─── Dropdown ─────────────────────────────────────────────────────────
    function injectDropdown() {
        var dropdown = document.createElement("div");
        dropdown.className = "lang-dropdown";
        dropdown.id = "langDropdown";
        dropdown.setAttribute("hidden", "");
        dropdown.innerHTML =
            '<button class="lang-option" data-lang="en" type="button">' +
            '<span class="lang-option__code">EN</span>' +
            '<span class="lang-option__name">English</span>' +
            "</button>" +
            '<button class="lang-option" data-lang="es" type="button">' +
            '<span class="lang-option__code">ES</span>' +
            '<span class="lang-option__name">Español</span>' +
            "</button>";
        document.body.appendChild(dropdown);

        dropdown.querySelectorAll(".lang-option").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                setLanguage(btn.getAttribute("data-lang"));
                closeDropdown();
            });
        });
    }

    function positionDropdown(anchor) {
        var dropdown = document.getElementById("langDropdown");
        var rect = anchor.getBoundingClientRect();
        dropdown.style.top = rect.bottom + 8 + "px";
        dropdown.style.right = window.innerWidth - rect.right + "px";
        dropdown.style.left = "auto";
    }

    function openDropdown(anchor) {
        var dropdown = document.getElementById("langDropdown");
        positionDropdown(anchor);
        dropdown.removeAttribute("hidden");
        anchor.setAttribute("aria-expanded", "true");
    }

    function closeDropdown() {
        var dropdown = document.getElementById("langDropdown");
        if (!dropdown) return;
        dropdown.setAttribute("hidden", "");
        document.querySelectorAll(".lang-toggle-desktop").forEach(function (btn) {
            btn.setAttribute("aria-expanded", "false");
        });
    }

    function isDropdownOpen() {
        var dropdown = document.getElementById("langDropdown");
        return dropdown && !dropdown.hasAttribute("hidden");
    }

    // ─── Init ─────────────────────────────────────────────────────────────
    document.addEventListener("DOMContentLoaded", function () {
        injectDropdown();

        document.querySelectorAll(".lang-toggle-desktop").forEach(function (btn) {
            btn.setAttribute("aria-haspopup", "true");
            btn.setAttribute("aria-expanded", "false");
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                if (isDropdownOpen()) {
                    closeDropdown();
                } else {
                    openDropdown(btn);
                }
            });
        });

        document.querySelectorAll(".lang-toggle-mobile").forEach(function (btn) {
            btn.addEventListener("click", function () {
                setLanguage(currentLang === "en" ? "es" : "en");
            });
        });

        document.addEventListener("click", function () {
            if (isDropdownOpen()) closeDropdown();
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && isDropdownOpen()) closeDropdown();
        });

        loadLocale(currentLang, applyTranslations);
    });
})();
