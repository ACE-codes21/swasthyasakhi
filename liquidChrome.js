// LiquidChrome WebGL Effect - Vanilla JS Implementation
class LiquidChrome {
    constructor(container, options = {}) {
        this.container = container;
        this.baseColor = options.baseColor || [0.1, 0.1, 0.1];
        this.speed = options.speed || 1;
        this.amplitude = options.amplitude || 0.6;
        this.frequencyX = options.frequencyX || 3;
        this.frequencyY = options.frequencyY || 3;
        this.interactive = options.interactive !== undefined ? options.interactive : true;
        
        this.mouse = { x: 0.5, y: 0.5 };
        this.init();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        this.container.appendChild(this.canvas);

        // Get WebGL context
        this.gl = this.canvas.getContext('webgl', { antialias: true });
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        this.gl.clearColor(1, 1, 1, 1);

        // Vertex shader
        const vertexShaderSource = `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        // Fragment shader
        const fragmentShaderSource = `
            precision highp float;
            uniform float uTime;
            uniform vec3 uResolution;
            uniform vec3 uBaseColor;
            uniform float uAmplitude;
            uniform float uFrequencyX;
            uniform float uFrequencyY;
            uniform vec2 uMouse;
            varying vec2 vUv;

            vec4 renderImage(vec2 uvCoord) {
                vec2 fragCoord = uvCoord * uResolution.xy;
                vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

                for (float i = 1.0; i < 10.0; i++){
                    uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
                    uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
                }

                vec2 diff = (uvCoord - uMouse);
                float dist = length(diff);
                float falloff = exp(-dist * 20.0);
                float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
                uv += (diff / (dist + 0.0001)) * ripple * falloff;

                vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
                return vec4(color, 1.0);
            }

            void main() {
                vec4 col = vec4(0.0);
                int samples = 0;
                for (int i = -1; i <= 1; i++){
                    for (int j = -1; j <= 1; j++){
                        vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
                        col += renderImage(vUv + offset);
                        samples++;
                    }
                }
                gl_FragColor = col / float(samples);
            }
        `;

        // Compile shaders
        const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);

        // Create program
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(this.program));
            return;
        }

        this.gl.useProgram(this.program);

        // Create geometry (fullscreen triangle)
        const positions = new Float32Array([
            -1, -1,
            3, -1,
            -1, 3
        ]);

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

        const positionLocation = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Get uniform locations
        this.uniforms = {
            uTime: this.gl.getUniformLocation(this.program, 'uTime'),
            uResolution: this.gl.getUniformLocation(this.program, 'uResolution'),
            uBaseColor: this.gl.getUniformLocation(this.program, 'uBaseColor'),
            uAmplitude: this.gl.getUniformLocation(this.program, 'uAmplitude'),
            uFrequencyX: this.gl.getUniformLocation(this.program, 'uFrequencyX'),
            uFrequencyY: this.gl.getUniformLocation(this.program, 'uFrequencyY'),
            uMouse: this.gl.getUniformLocation(this.program, 'uMouse')
        };

        // Set initial uniforms
        this.gl.uniform3f(this.uniforms.uBaseColor, ...this.baseColor);
        this.gl.uniform1f(this.uniforms.uAmplitude, this.amplitude);
        this.gl.uniform1f(this.uniforms.uFrequencyX, this.frequencyX);
        this.gl.uniform1f(this.uniforms.uFrequencyY, this.frequencyY);
        this.gl.uniform2f(this.uniforms.uMouse, this.mouse.x, this.mouse.y);

        // Setup event listeners
        this.setupEventListeners();

        // Start animation
        this.resize();
        this.startTime = Date.now();
        this.animate();
    }

    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    setupEventListeners() {
        this.handleResize = this.resize.bind(this);
        window.addEventListener('resize', this.handleResize);

        if (this.interactive) {
            this.handleMouseMove = (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = (e.clientX - rect.left) / rect.width;
                this.mouse.y = 1 - (e.clientY - rect.top) / rect.height;
            };

            this.handleTouchMove = (e) => {
                if (e.touches.length > 0) {
                    const touch = e.touches[0];
                    const rect = this.container.getBoundingClientRect();
                    this.mouse.x = (touch.clientX - rect.left) / rect.width;
                    this.mouse.y = 1 - (touch.clientY - rect.top) / rect.height;
                }
            };

            this.container.addEventListener('mousemove', this.handleMouseMove);
            this.container.addEventListener('touchmove', this.handleTouchMove);
        }
    }

    resize() {
        const scale = window.devicePixelRatio || 1;
        this.canvas.width = this.container.offsetWidth * scale;
        this.canvas.height = this.container.offsetHeight * scale;
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.uniform3f(
            this.uniforms.uResolution,
            this.canvas.width,
            this.canvas.height,
            this.canvas.width / this.canvas.height
        );
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        const currentTime = (Date.now() - this.startTime) * 0.001 * this.speed;
        this.gl.uniform1f(this.uniforms.uTime, currentTime);
        this.gl.uniform2f(this.uniforms.uMouse, this.mouse.x, this.mouse.y);
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        window.removeEventListener('resize', this.handleResize);

        if (this.interactive) {
            this.container.removeEventListener('mousemove', this.handleMouseMove);
            this.container.removeEventListener('touchmove', this.handleTouchMove);
        }

        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }

        if (this.gl) {
            const loseContext = this.gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
                loseContext.loseContext();
            }
        }
    }
}

// Initialize LiquidChrome on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        new LiquidChrome(heroBackground, {
            baseColor: [0.8, 0.1, 0.1], // Red color for health theme
            speed: 1,
            amplitude: 0.6,
            frequencyX: 3,
            frequencyY: 3,
            interactive: true
        });
    }
});
