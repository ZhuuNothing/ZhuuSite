import { useEffect, useRef, useCallback } from "react";

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayOffset: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  radius: number;
  life: number;
  maxLife: number;
}

interface Fish {
  x: number;
  y: number;
  speed: number;
  direction: number;
  waveAmplitude: number;
  waveSpeed: number;
  waveOffset: number;
  size: number;
  opacity: number;
  color: string;
  layer: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export default function OceanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const bubblesRef = useRef<Bubble[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const fishRef = useRef<Fish[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const timeRef = useRef(0);

  const createBubble = useCallback((canvas: HTMLCanvasElement): Bubble => {
    const colors = ['rgba(0,255,255,', 'rgba(0,200,230,', 'rgba(100,240,255,', 'rgba(0,180,220,'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      radius: Math.random() * 6 + 2,
      speed: Math.random() * 1.2 + 0.4,
      opacity: Math.random() * 0.5 + 0.2,
      swayAmplitude: Math.random() * 30 + 10,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      color,
    };
  }, []);

  const createFish = useCallback((canvas: HTMLCanvasElement): Fish => {
    const colors = ['rgba(0,200,255,', 'rgba(0,230,220,', 'rgba(100,220,255,', 'rgba(0,180,200,', 'rgba(50,210,230,'];
    const dir = Math.random() > 0.5 ? 1 : -1;
    return {
      x: dir === 1 ? -150 : canvas.width + 150,
      y: Math.random() * (canvas.height * 0.7) + 50,
      speed: (Math.random() * 1.5 + 0.8) * dir,
      direction: dir,
      waveAmplitude: Math.random() * 20 + 8,
      waveSpeed: Math.random() * 0.04 + 0.02,
      waveOffset: Math.random() * Math.PI * 2,
      size: Math.random() * 20 + 12,
      opacity: Math.random() * 0.4 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      layer: Math.floor(Math.random() * 3),
    };
  }, []);

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.3 + 0.1),
      opacity: Math.random() * 0.6 + 0.2,
      radius: Math.random() * 2 + 0.5,
      life: 0,
      maxLife: Math.random() * 200 + 100,
    };
  }, []);

  const drawFish = useCallback((ctx: CanvasRenderingContext2D, fish: Fish, t: number) => {
    const yOff = Math.sin(t * fish.waveSpeed + fish.waveOffset) * fish.waveAmplitude;
    const x = fish.x;
    const y = fish.y + yOff;
    const dir = fish.direction;
    const s = fish.size;
    const op = fish.opacity;
    const blur = fish.layer * 1.5;

    ctx.save();
    ctx.globalAlpha = op;
    if (blur > 0) ctx.filter = `blur(${blur}px)`;

    ctx.translate(x, y);
    ctx.scale(dir, 1);

    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.45, 0, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(-s * 0.2, 0, 0, 0, 0, s);
    grad.addColorStop(0, `${fish.color}0.8)`);
    grad.addColorStop(0.7, `${fish.color}0.4)`);
    grad.addColorStop(1, `${fish.color}0.1)`);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-s * 0.7, 0);
    ctx.lineTo(-s * 1.3, -s * 0.5);
    ctx.lineTo(-s * 1.3, s * 0.5);
    ctx.closePath();
    ctx.fillStyle = `${fish.color}0.3)`;
    ctx.fill();

    const tailWave = Math.sin(t * fish.waveSpeed * 3 + fish.waveOffset) * 0.3;
    ctx.beginPath();
    ctx.moveTo(-s * 0.8, 0);
    ctx.lineTo(-s * 1.5, -s * 0.35 + tailWave * s);
    ctx.lineTo(-s * 1.5, s * 0.35 + tailWave * s);
    ctx.closePath();
    ctx.fillStyle = `${fish.color}0.4)`;
    ctx.fill();

    ctx.restore();
    ctx.filter = 'none';
  }, []);

  const drawBubble = useCallback((ctx: CanvasRenderingContext2D, bubble: Bubble, t: number) => {
    const xOff = Math.sin(t * bubble.swaySpeed + bubble.swayOffset) * bubble.swayAmplitude;

    ctx.save();
    ctx.globalAlpha = bubble.opacity;

    ctx.beginPath();
    ctx.arc(bubble.x + xOff, bubble.y, bubble.radius, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(
      bubble.x + xOff - bubble.radius * 0.3,
      bubble.y - bubble.radius * 0.3,
      bubble.radius * 0.1,
      bubble.x + xOff,
      bubble.y,
      bubble.radius
    );
    grad.addColorStop(0, `${bubble.color}0.6)`);
    grad.addColorStop(0.6, `${bubble.color}0.15)`);
    grad.addColorStop(1, `${bubble.color}0.05)`);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(bubble.x + xOff, bubble.y, bubble.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `${bubble.color}0.5)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    const shimX = bubble.x + xOff - bubble.radius * 0.35;
    const shimY = bubble.y - bubble.radius * 0.3;
    ctx.beginPath();
    ctx.arc(shimX, shimY, bubble.radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fill();

    ctx.restore();
  }, []);

  const drawLightRays = useCallback((ctx: CanvasRenderingContext2D, width: number, t: number) => {
    const rayCount = 6;
    for (let i = 0; i < rayCount; i++) {
      const x = (width / (rayCount + 1)) * (i + 1) + Math.sin(t * 0.002 + i) * 30;
      const opacity = 0.03 + Math.sin(t * 0.003 + i * 1.2) * 0.02;
      const rayWidth = 60 + Math.sin(t * 0.004 + i) * 20;

      const grad = ctx.createLinearGradient(x, 0, x, ctx.canvas.height * 0.8);
      grad.addColorStop(0, `rgba(0,220,255,${opacity})`);
      grad.addColorStop(0.5, `rgba(0,180,220,${opacity * 0.6})`);
      grad.addColorStop(1, 'rgba(0,180,220,0)');

      ctx.save();
      ctx.transform(1, 0, 0.15, 1, -x * 0.15, 0);
      ctx.fillStyle = grad;
      ctx.fillRect(x - rayWidth / 2, 0, rayWidth, ctx.canvas.height * 0.8);
      ctx.restore();
    }
  }, []);

  const drawRipples = useCallback((ctx: CanvasRenderingContext2D) => {
    ripplesRef.current = ripplesRef.current.filter(r => r.opacity > 0.01);
    ripplesRef.current.forEach(r => {
      r.radius += 3;
      r.opacity *= 0.94;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,255,255,${r.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    bubblesRef.current = Array.from({ length: 35 }, () => {
      const b = createBubble(canvas);
      b.y = Math.random() * canvas.height;
      return b;
    });
    fishRef.current = Array.from({ length: 8 }, () => createFish(canvas));
    particlesRef.current = Array.from({ length: 60 }, () => createParticle(canvas));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: i * 8,
          maxRadius: 80,
          opacity: 0.7 - i * 0.15,
        });
      }
      for (let i = 0; i < 6; i++) {
        bubblesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 40,
          y: e.clientY + (Math.random() - 0.5) * 20,
          radius: Math.random() * 8 + 3,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          swayAmplitude: Math.random() * 40 + 15,
          swaySpeed: Math.random() * 0.03 + 0.01,
          swayOffset: Math.random() * Math.PI * 2,
          color: 'rgba(0,255,255,',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const animate = () => {
      timeRef.current++;
      const t = timeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawLightRays(ctx, canvas.width, t);

      bubblesRef.current.forEach((bubble, i) => {
        bubble.y -= bubble.speed;
        const mouse = mouseRef.current;
        const dx = bubble.x + Math.sin(t * bubble.swaySpeed + bubble.swayOffset) * bubble.swayAmplitude - mouse.x;
        const dy = bubble.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = (80 - dist) / 80;
          bubble.x += (dx / dist) * force * 2;
        }
        drawBubble(ctx, bubble, t);
        if (bubble.y < -20) {
          bubblesRef.current[i] = createBubble(canvas);
        }
      });

      while (bubblesRef.current.length < 35) {
        bubblesRef.current.push(createBubble(canvas));
      }

      ctx.save();
      ctx.globalAlpha = 0.6;
      fishRef.current.forEach((fish, i) => {
        fish.x += fish.speed;
        drawFish(ctx, fish, t);
        const outLeft = fish.direction === 1 && fish.x > canvas.width + 200;
        const outRight = fish.direction === -1 && fish.x < -200;
        if (outLeft || outRight) {
          fishRef.current[i] = createFish(canvas);
        }
      });
      ctx.restore();

      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const lifeRatio = p.life / p.maxLife;
        const opacity = p.opacity * (1 - lifeRatio);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,220,255,${opacity})`;
        ctx.fill();

        if (p.life >= p.maxLife || p.y < 0 || p.y > canvas.height) {
          particlesRef.current[i] = createParticle(canvas);
        }
      });

      drawRipples(ctx);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [createBubble, createFish, createParticle, drawBubble, drawFish, drawLightRays, drawRipples]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.9 }}
      data-testid="ocean-canvas"
    />
  );
}
