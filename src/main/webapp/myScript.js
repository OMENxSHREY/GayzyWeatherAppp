// myScript.js

// Wait for both DOM and window to be fully loaded
window.addEventListener('load', function() {
    // Add weather effects handler
    function initWeatherEffects() {
        const weatherCondition = document.getElementById('weatherCondition');
        if (!weatherCondition) return;
        
        const condition = weatherCondition.textContent.toLowerCase();
        const weatherEffects = document.createElement('div');
        weatherEffects.className = 'weather-effects';
        
        // Remove any existing weather effects
        const existingEffects = document.querySelector('.weather-effects');
        if (existingEffects) {
            existingEffects.remove();
        }

        // Add weather effects to body
        document.body.appendChild(weatherEffects);

        // Add appropriate weather effect based on condition
        if (condition.includes('clear') || condition.includes('sun')) {
            weatherEffects.innerHTML = `
                <div class="sunny-effect"></div>
                <div class="sparkles"></div>
            `;
        } else if (condition.includes('cloud')) {
            weatherEffects.innerHTML = '<div class="cloudy-effect"></div>';
            // Create multiple clouds
            for (let i = 0; i < 5; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                cloud.style.top = `${Math.random() * 50}%`;
                cloud.style.animationDuration = `${15 + Math.random() * 10}s`;
                cloud.style.animationDelay = `${Math.random() * 5}s`;
                weatherEffects.appendChild(cloud);
            }
        } else if (condition.includes('rain')) {
            weatherEffects.innerHTML = `
                <div class="rain-effect"></div>
                <div class="lightning-effect"></div>
            `;
            // Create rain drops
            for (let i = 0; i < 100; i++) {
                const drop = document.createElement('div');
                drop.className = 'rain-drop';
                drop.style.left = `${Math.random() * 100}%`;
                drop.style.animationDuration = `${0.5 + Math.random()}s`;
                drop.style.animationDelay = `${Math.random()}s`;
                weatherEffects.appendChild(drop);
            }
        } else if (condition.includes('snow')) {
            weatherEffects.innerHTML = '<div class="snow-effect"></div>';
            // Create snowflakes
            for (let i = 0; i < 50; i++) {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.style.left = `${Math.random() * 100}%`;
                snowflake.style.animationDuration = `${3 + Math.random() * 5}s`;
                snowflake.style.animationDelay = `${Math.random() * 3}s`;
                weatherEffects.appendChild(snowflake);
            }
        }
    }

    // Initialize weather effects
    initWeatherEffects();

    // Debug log
    console.log('Initializing 3D Earth...');
    
    // Get container and check if it exists
    const container = document.getElementById('earth-container');
    if (!container) {
        console.error('Earth container not found!');
        return;
    }
    
    // Debug container dimensions
    console.log('Container found with dimensions:', container.clientWidth, container.clientHeight);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 18;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Earth setup
    const geometry = new THREE.SphereGeometry(7, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
        bumpMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'),
        bumpScale: 0.05,
        specularMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'),
        specular: new THREE.Color('grey')
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Raycaster setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Convert 3D point to latitude and longitude
    function cartesianToLatLng(point) {
        const radius = 5; // Earth radius in our scene
        const normalized = point.clone().divideScalar(radius);
        
        const lat = 90 - (Math.acos(normalized.y) * 180 / Math.PI);
        const lng = ((270 + (Math.atan2(normalized.x, normalized.z) * 180 / Math.PI)) % 360) - 180;
        
        return { lat, lng };
    }

    // Click event handler
    container.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Calculate mouse position
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        // Update the picking ray
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections
        const intersects = raycaster.intersectObject(earth);

        if (intersects.length > 0) {
            const point = intersects[0].point;
            const latLng = cartesianToLatLng(point);
            
            console.log('Clicked coordinates:', latLng);

            // Get the form
            const form = document.getElementById('weatherForm');
            if (!form) {
                console.error('Weather form not found!');
                return;
            }

            // Update form fields
            const latInput = document.getElementById('latitude');
            const lonInput = document.getElementById('longitude');
            const cityInput = document.getElementById('city');

            if (latInput && lonInput && cityInput) {
                latInput.value = latLng.lat.toFixed(6);
                lonInput.value = latLng.lng.toFixed(6);
                cityInput.value = ''; // Clear city input
                
                console.log('Submitting coordinates:', latInput.value, lonInput.value);
                form.submit();
            } else {
                console.error('Form inputs not found!');
            }
        }
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Add hover effect
    container.style.cursor = 'pointer';

    // Sparkle effect initialization
    function initSparkles() {
        // Create container if it doesn't exist
        let sparklesContainer = document.querySelector('.magical-sparkles');
        if (!sparklesContainer) {
            sparklesContainer = document.createElement('div');
            sparklesContainer.className = 'magical-sparkles';
            document.body.appendChild(sparklesContainer);
        }

        // Clear existing sparkles
        sparklesContainer.innerHTML = '';
        
        function createSparkle() {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.animationDuration = `${2 + Math.random() * 3}s`;
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
            sparklesContainer.appendChild(sparkle);

            // Remove sparkle after animation
            sparkle.addEventListener('animationend', () => sparkle.remove());
        }

        // Create initial batch of sparkles
        for (let i = 0; i < 30; i++) {
            setTimeout(createSparkle, Math.random() * 2000);
        }

        // Continuously create new sparkles
        setInterval(() => {
            if (sparklesContainer.children.length < 30) {
                createSparkle();
            }
        }, 200);
    }

    // Update sparkle styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .magical-sparkles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        }

        .sparkle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #ffd700;
            border-radius: 50%;
            animation: sparkleFloat linear infinite;
            box-shadow: 
                0 0 10px #ffd700,
                0 0 20px #ffd700,
                0 0 30px #ffd700;
        }

        @keyframes sparkleFloat {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 0;
            }
            50% {
                transform: scale(1) rotate(180deg);
                opacity: 0.8;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // Initialize everything when the page loads
    initSparkles();

    // Add Christmas effects
    function initChristmasEffects() {
        // Create snow container
        const snowContainer = document.createElement('div');
        snowContainer.className = 'snow-container';
        document.body.appendChild(snowContainer);

        // Create snowflakes
        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.opacity = Math.random();
            snowflake.style.width = `${Math.random() * 5 + 2}px`;
            snowflake.style.height = snowflake.style.width;
            snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
            snowflake.style.animationDelay = `${Math.random() * 2}s`;
            snowContainer.appendChild(snowflake);

            // Remove snowflake after animation
            snowflake.addEventListener('animationend', () => snowflake.remove());
        }

        // Create initial batch of snowflakes
        for (let i = 0; i < 50; i++) {
            setTimeout(createSnowflake, Math.random() * 2000);
        }

        // Continuously create new snowflakes
        setInterval(createSnowflake, 200);

        // Add Christmas decorations to weather items
        const weatherItems = document.querySelectorAll('.weather-item');
        weatherItems.forEach(item => {
            // Add holly decoration
            const holly = document.createElement('div');
            holly.className = 'holly';
            holly.innerHTML = '🎄';
            holly.style.position = 'absolute';
            holly.style.top = '10px';
            holly.style.right = '10px';
            holly.style.fontSize = '20px';
            item.appendChild(holly);
        });
    }

    // Initialize Christmas effects
    initChristmasEffects();

    // Modify the earth texture to add snow caps
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
        bumpMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'),
        bumpScale: 0.05,
        specularMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'),
        specular: new THREE.Color('white'), // Make specular highlights more snow-like
        shininess: 50 // Increase shininess for a frosty look
    });

    // Add a subtle white glow to the earth
    const earthGlow = new THREE.Mesh(
        new THREE.SphereGeometry(7.2, 64, 64),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1
        })
    );
    scene.add(earthGlow);
});
