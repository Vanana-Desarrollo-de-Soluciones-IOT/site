const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.header');
const mobileMenu = document.querySelector('.mobile-menu');

lucide.createIcons();

function closeMenu() {
    header.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    lucide.createIcons();
}

menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu');
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    menuToggle.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';
    lucide.createIcons();
});

mobileMenu.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', closeMenu);
});

(function() {
    const canvas = document.getElementById('graph-world');
    const ctx = canvas.getContext('2d');
    let width, height, animFrame;
    const FOV = 800;
    const EARTH_RADIUS = Math.min(window.innerWidth, window.innerHeight) * 0.28;

    const COUNTRIES = [
        { name: 'Spain', lat: 40.46, lon: -3.75 },
        { name: 'France', lat: 46.23, lon: 2.21 },
        { name: 'Germany', lat: 51.17, lon: 10.45 },
        { name: 'Italy', lat: 41.87, lon: 12.57 },
        { name: 'Portugal', lat: 39.40, lon: -8.22 },
        { name: 'UK', lat: 55.38, lon: -3.44 },
        { name: 'Ireland', lat: 53.41, lon: -8.24 },
        { name: 'Netherlands', lat: 52.13, lon: 5.29 },
        { name: 'Belgium', lat: 50.50, lon: 4.47 },
        { name: 'Switzerland', lat: 46.82, lon: 8.23 },
        { name: 'Austria', lat: 47.52, lon: 14.55 },
        { name: 'Poland', lat: 51.92, lon: 19.15 },
        { name: 'Czech Republic', lat: 49.82, lon: 15.47 },
        { name: 'Sweden', lat: 60.13, lon: 18.64 },
        { name: 'Norway', lat: 60.47, lon: 8.47 },
        { name: 'Finland', lat: 61.92, lon: 25.75 },
        { name: 'Denmark', lat: 56.26, lon: 9.50 },
        { name: 'Greece', lat: 39.07, lon: 21.82 },
        { name: 'Turkey', lat: 38.96, lon: 35.24 },
        { name: 'Russia', lat: 61.52, lon: 105.32 },
        { name: 'Ukraine', lat: 48.38, lon: 31.17 },
        { name: 'Romania', lat: 45.94, lon: 24.97 },
        { name: 'Hungary', lat: 47.16, lon: 19.50 },
        { name: 'Bulgaria', lat: 42.73, lon: 25.49 },
        { name: 'Serbia', lat: 44.02, lon: 21.01 },
        { name: 'Croatia', lat: 45.10, lon: 15.20 },
        { name: 'Slovakia', lat: 48.67, lon: 19.70 },
        { name: 'Slovenia', lat: 46.15, lon: 14.99 },
        { name: 'Estonia', lat: 58.59, lon: 25.01 },
        { name: 'Latvia', lat: 56.88, lon: 24.60 },
        { name: 'Lithuania', lat: 55.17, lon: 23.88 },
        { name: 'Belarus', lat: 53.71, lon: 27.97 },
        { name: 'USA', lat: 37.09, lon: -95.71 },
        { name: 'Canada', lat: 56.13, lon: -106.35 },
        { name: 'Mexico', lat: 23.63, lon: -102.55 },
        { name: 'Guatemala', lat: 15.78, lon: -90.23 },
        { name: 'Cuba', lat: 21.52, lon: -77.78 },
        { name: 'Haiti', lat: 18.97, lon: -72.68 },
        { name: 'Dominican Rep.', lat: 18.74, lon: -70.16 },
        { name: 'Panama', lat: 8.54, lon: -80.78 },
        { name: 'Colombia', lat: 4.57, lon: -74.30 },
        { name: 'Venezuela', lat: 6.42, lon: -66.59 },
        { name: 'Ecuador', lat: -1.83, lon: -78.18 },
        { name: 'Peru', lat: -9.19, lon: -75.02 },
        { name: 'Bolivia', lat: -16.29, lon: -63.59 },
        { name: 'Brazil', lat: -14.24, lon: -51.93 },
        { name: 'Argentina', lat: -38.42, lon: -63.62 },
        { name: 'Chile', lat: -35.68, lon: -71.54 },
        { name: 'Paraguay', lat: -23.44, lon: -58.44 },
        { name: 'Uruguay', lat: -32.52, lon: -55.77 },
        { name: 'China', lat: 35.86, lon: 104.20 },
        { name: 'Japan', lat: 36.20, lon: 138.25 },
        { name: 'South Korea', lat: 35.91, lon: 127.77 },
        { name: 'North Korea', lat: 40.34, lon: 127.51 },
        { name: 'India', lat: 20.59, lon: 78.96 },
        { name: 'Pakistan', lat: 30.38, lon: 69.35 },
        { name: 'Bangladesh', lat: 23.68, lon: 90.36 },
        { name: 'Thailand', lat: 15.87, lon: 100.99 },
        { name: 'Vietnam', lat: 14.06, lon: 108.28 },
        { name: 'Indonesia', lat: -0.79, lon: 113.92 },
        { name: 'Philippines', lat: 12.88, lon: 121.77 },
        { name: 'Malaysia', lat: 4.21, lon: 101.98 },
        { name: 'Singapore', lat: 1.35, lon: 103.82 },
        { name: 'Myanmar', lat: 21.91, lon: 95.96 },
        { name: 'Cambodia', lat: 12.57, lon: 104.99 },
        { name: 'Laos', lat: 19.86, lon: 102.50 },
        { name: 'Mongolia', lat: 46.86, lon: 103.85 },
        { name: 'Kazakhstan', lat: 48.02, lon: 66.93 },
        { name: 'Uzbekistan', lat: 41.38, lon: 64.59 },
        { name: 'Afghanistan', lat: 33.94, lon: 67.71 },
        { name: 'Iran', lat: 32.43, lon: 53.69 },
        { name: 'Iraq', lat: 33.22, lon: 43.68 },
        { name: 'Saudi Arabia', lat: 23.89, lon: 45.08 },
        { name: 'Yemen', lat: 15.55, lon: 48.52 },
        { name: 'Oman', lat: 21.51, lon: 55.92 },
        { name: 'UAE', lat: 23.42, lon: 53.85 },
        { name: 'Qatar', lat: 25.35, lon: 51.18 },
        { name: 'Kuwait', lat: 29.31, lon: 47.48 },
        { name: 'Israel', lat: 31.05, lon: 34.85 },
        { name: 'Jordan', lat: 30.59, lon: 36.24 },
        { name: 'Lebanon', lat: 33.85, lon: 35.86 },
        { name: 'Syria', lat: 34.80, lon: 38.30 },
        { name: 'Egypt', lat: 26.82, lon: 30.80 },
        { name: 'Libya', lat: 26.34, lon: 17.23 },
        { name: 'Algeria', lat: 28.03, lon: 1.66 },
        { name: 'Morocco', lat: 31.79, lon: -7.09 },
        { name: 'Tunisia', lat: 33.89, lon: 9.54 },
        { name: 'Nigeria', lat: 9.08, lon: 8.68 },
        { name: 'Ghana', lat: 7.95, lon: -1.02 },
        { name: 'Senegal', lat: 14.50, lon: -14.45 },
        { name: 'Mali', lat: 17.57, lon: -3.99 },
        { name: 'Niger', lat: 17.61, lon: 8.08 },
        { name: 'Chad', lat: 15.45, lon: 18.73 },
        { name: 'Sudan', lat: 12.86, lon: 30.22 },
        { name: 'Ethiopia', lat: 9.15, lon: 40.49 },
        { name: 'Kenya', lat: -0.02, lon: 37.91 },
        { name: 'Tanzania', lat: -6.37, lon: 34.89 },
        { name: 'DR Congo', lat: -4.04, lon: 21.76 },
        { name: 'Angola', lat: -11.20, lon: 17.87 },
        { name: 'Mozambique', lat: -18.67, lon: 35.53 },
        { name: 'South Africa', lat: -30.56, lon: 22.94 },
        { name: 'Madagascar', lat: -18.77, lon: 46.87 },
        { name: 'Australia', lat: -25.27, lon: 133.78 },
        { name: 'New Zealand', lat: -40.90, lon: 174.89 },
        { name: 'Papua New Guinea', lat: -6.31, lon: 143.96 }
    ];

    function latLonToCart(lat, lon, r) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lon + 180) * Math.PI / 180;
        return {
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.cos(phi),
            z: r * Math.sin(phi) * Math.sin(theta)
        };
    }

    function rotateY(pt, angle) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        return { x: pt.x * cos - pt.z * sin, y: pt.y, z: pt.x * sin + pt.z * cos };
    }

    function rotateX(pt, angle) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        return { x: pt.x, y: pt.y * cos - pt.z * sin, z: pt.y * sin + pt.z * cos };
    }

    function project(pt, cx, cy) {
        const scale = FOV / (FOV + pt.z);
        return { x: cx + pt.x * scale, y: cy + pt.y * scale, z: pt.z, scale };
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function draw(t) {
        const cx = width / 2, cy = height / 2;
        const tilt = 0.52;
        const spin = t * 0.00015;

        ctx.fillStyle = '#05070a';
        ctx.fillRect(0, 0, width, height);

        const gridStep = 12;
        for (let lat = -90; lat <= 90; lat += gridStep) {
            const row = [];
            for (let lon = -180; lon <= 180; lon += gridStep) {
                let pt = latLonToCart(lat, lon, EARTH_RADIUS);
                pt = rotateY(pt, spin);
                pt = rotateX(pt, tilt);
                row.push(project(pt, cx, cy));
            }
            for (let i = 0; i < row.length - 1; i++) {
                const alpha = Math.max(0.15, 0.45 * (1 - row[i].z / EARTH_RADIUS));
                ctx.beginPath();
                ctx.moveTo(row[i].x, row[i].y);
                ctx.lineTo(row[i + 1].x, row[i + 1].y);
                ctx.strokeStyle = `rgba(60, 80, 100, ${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        for (let lon = -180; lon <= 180; lon += gridStep * 1.5) {
            const col = [];
            for (let lat = -90; lat <= 90; lat += gridStep) {
                let pt = latLonToCart(lat, lon, EARTH_RADIUS);
                pt = rotateY(pt, spin);
                pt = rotateX(pt, tilt);
                col.push(project(pt, cx, cy));
            }
            for (let i = 0; i < col.length - 1; i++) {
                const alpha = Math.max(0.15, 0.40 * (1 - col[i].z / EARTH_RADIUS));
                ctx.beginPath();
                ctx.moveTo(col[i].x, col[i].y);
                ctx.lineTo(col[i + 1].x, col[i + 1].y);
                ctx.strokeStyle = `rgba(60, 80, 100, ${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        const countryPoints = COUNTRIES.map(c => {
            let pt = latLonToCart(c.lat, c.lon, EARTH_RADIUS);
            pt = rotateY(pt, spin);
            pt = rotateX(pt, tilt);
            return project(pt, cx, cy);
        });

        for (let i = 0; i < countryPoints.length; i++) {
            const p = countryPoints[i];
            const alpha = Math.max(0.3, 1 - p.z / EARTH_RADIUS);
            const size = 1.2;

            const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
            glow.addColorStop(0, `rgba(200, 220, 255, ${0.3 * alpha})`);
            glow.addColorStop(1, 'rgba(200, 220, 255, 0)');
            ctx.beginPath();
            ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * alpha})`;
            ctx.fill();
        }

        animFrame = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw(0);
})();