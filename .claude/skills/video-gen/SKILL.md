---
name: video-gen
description: |
  Generar videos programaticos con Remotion + React. Composiciones como componentes React,
  preview en browser, render a MP4/WebM/GIF via CLI o API. Ideal para videos data-driven,
  social clips personalizados, product demos animados y reportes visuales.
  Requiere: Node.js 18+, Chrome/Chromium instalado.
  Triggers: video, genera video, create video, remotion, animacion, clip, social media video,
  render video, video programatico, video template, video desde datos, mp4, webm, gif,
  explainer video, product demo, video con datos, dashboard animado, video automatico.
argument-hint: "[template: setup|social-clip|data-dashboard|product-demo|custom]"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Video Generation (Remotion + React)

> Implementar: $ARGUMENTS

Stack: **Remotion 4 + React 19 + TypeScript + Tailwind CSS**

---

## Templates Disponibles

| # | Template | Descripcion |
|---|----------|-------------|
| 00 | **setup** | Instalar Remotion, configurar estructura, crear primera composicion de prueba |
| 01 | **social-clip** | Clip para redes (TikTok/Reels/Shorts): texto animado + fondo + musica |
| 02 | **data-dashboard** | Dashboard animado: graficas, contadores, KPIs que se animan con datos reales |
| 03 | **product-demo** | Demo de producto: screenshots + transiciones + call-to-action |
| 04 | **custom** | Composicion desde cero segun lo que describa el usuario |

---

## Template 00: Setup

### Paso 1 — Instalar dependencias

```bash
npm i remotion @remotion/cli @remotion/player @remotion/renderer
npm i -D @remotion/tailwind
```

### Paso 2 — Estructura de archivos

```
src/
  remotion/
    index.ts              # Root — registra todas las composiciones
    compositions/
      HelloWorld.tsx       # Composicion de ejemplo
    lib/
      use-animation.ts    # Hook de animacion reutilizable
  app/
    videos/
      page.tsx            # Preview page con <Player>
    api/
      render/
        route.ts          # API para render server-side
```

### Paso 3 — Root de composiciones

Crear `src/remotion/index.ts`:

```tsx
import { Composition } from "remotion";
import { HelloWorld } from "./compositions/HelloWorld";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Mission Control",
          subtitle: "SaaS Portfolio OS",
        }}
      />
    </>
  );
};
```

### Paso 4 — Primera composicion

Crear `src/remotion/compositions/HelloWorld.tsx`:

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface Props {
  title: string;
  subtitle: string;
}

export const HelloWorld: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#070b0f]">
      <h1
        className="text-7xl font-bold text-white font-mono"
        style={{ transform: `scale(${titleScale})` }}
      >
        {title}
      </h1>
      <p
        className="text-2xl text-[#6e7b8b] mt-4 font-mono"
        style={{ opacity: subtitleOpacity }}
      >
        {subtitle}
      </p>
    </div>
  );
};
```

### Paso 5 — Hook de animacion reutilizable

Crear `src/remotion/lib/use-animation.ts`:

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export function useFadeIn(startFrame: number, duration = 20) {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function useSlideIn(startFrame: number, from = 50) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 12 } });
  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [from, 0])}px)`,
  };
}

export function useCountUp(startFrame: number, endFrame: number, target: number) {
  const frame = useCurrentFrame();
  const raw = interpolate(frame, [startFrame, endFrame], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.round(raw);
}
```

### Paso 6 — Page de preview con Player

Crear `src/app/videos/page.tsx`:

```tsx
"use client";
import { Player } from "@remotion/player";
import { HelloWorld } from "@/remotion/compositions/HelloWorld";

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-[#070b0f] flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-bold text-white font-mono mb-4">VIDEO PREVIEW</h1>
        <Player
          component={HelloWorld}
          inputProps={{ title: "Mission Control", subtitle: "SaaS Portfolio OS" }}
          durationInFrames={150}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{ width: "100%", aspectRatio: "16/9" }}
          controls
          autoPlay
          loop
        />
      </div>
    </div>
  );
}
```

### Paso 7 — API route para render server-side

Crear `src/app/api/render/route.ts`:

```tsx
import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";

export async function POST(req: NextRequest) {
  const { compositionId, inputProps, format = "mp4" } = await req.json();

  const bundled = await bundle({
    entryPoint: path.resolve(process.cwd(), "src/remotion/index.ts"),
    webpackOverride: (config) => config,
  });

  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps,
  });

  const outputPath = path.resolve(
    process.cwd(),
    `public/videos/${compositionId}-${Date.now()}.${format}`
  );

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: format === "gif" ? "gif" : format === "webm" ? "vp8" : "h264",
    outputLocation: outputPath,
    inputProps,
  });

  const publicPath = outputPath.replace(path.resolve(process.cwd(), "public"), "");
  return NextResponse.json({ url: publicPath });
}
```

### Paso 8 — Comandos CLI

Agregar a `package.json`:

```json
{
  "scripts": {
    "video:preview": "npx remotion preview src/remotion/index.ts",
    "video:render": "npx remotion render src/remotion/index.ts",
    "video:still": "npx remotion still src/remotion/index.ts"
  }
}
```

### Paso 9 — Verificar

```bash
# Preview en browser (servidor de Remotion dedicado)
npm run video:preview

# Render a MP4
npm run video:render -- HelloWorld --output public/videos/hello.mp4

# Capturar un frame como imagen
npm run video:still -- HelloWorld --frame=75 --output public/videos/thumbnail.png
```

---

## Template 01: Social Clip

Clip de 9:16 para TikTok/Reels/Shorts. Texto animado + fondo gradiente + duracion 5-15 segundos.

### Composicion

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

interface SocialClipProps {
  lines: string[];
  brandColor?: string;
  bgGradient?: [string, string];
}

export const SocialClip: React.FC<SocialClipProps> = ({
  lines,
  brandColor = "#bc8cff",
  bgGradient = ["#070b0f", "#1a0f2e"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center px-12"
      style={{ background: `linear-gradient(135deg, ${bgGradient[0]}, ${bgGradient[1]})` }}
    >
      {lines.map((line, i) => {
        const delay = i * 25;
        const scale = spring({ frame: frame - delay, fps, config: { damping: 10 } });
        const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            className="text-5xl font-black text-center leading-tight my-2"
            style={{
              color: i === lines.length - 1 ? brandColor : "#ffffff",
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
```

### Registrar en Root

```tsx
<Composition
  id="SocialClip"
  component={SocialClip}
  durationInFrames={180}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    lines: ["Tu portafolio SaaS", "en una sola vista", "Mission Control"],
  }}
/>
```

### Render

```bash
npm run video:render -- SocialClip --output public/videos/clip.mp4
```

---

## Template 02: Data Dashboard

Dashboard animado con KPIs, barras y numeros que se animan. Ideal para reportes de portafolio.

### Composicion

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

interface DashboardVideoProps {
  title: string;
  kpis: { label: string; value: number; prefix?: string; suffix?: string; color: string }[];
  period: string;
}

export const DataDashboard: React.FC<DashboardVideoProps> = ({ title, kpis, period }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12 } });

  return (
    <div className="w-full h-full bg-[#070b0f] p-16 flex flex-col">
      {/* Header */}
      <Sequence from={0}>
        <div style={{ transform: `scale(${titleSpring})` }}>
          <h1 className="text-5xl font-bold text-white font-mono">{title}</h1>
          <p className="text-xl text-[#6e7b8b] font-mono mt-2">{period}</p>
        </div>
      </Sequence>

      {/* KPIs grid */}
      <div className="grid grid-cols-2 gap-8 mt-16 flex-1">
        {kpis.map((kpi, i) => {
          const delay = 20 + i * 15;
          const enter = spring({ frame: frame - delay, fps, config: { damping: 10 } });
          const countEnd = delay + 40;
          const count = interpolate(frame, [delay, countEnd], [0, kpi.value], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <Sequence from={delay} key={i}>
              <div
                className="bg-[#0d1117] rounded-2xl p-8 border border-[#1a2332]"
                style={{ opacity: enter, transform: `translateY(${(1 - enter) * 30}px)` }}
              >
                <p className="text-lg text-[#6e7b8b] font-mono tracking-wider">{kpi.label}</p>
                <p className="text-6xl font-black font-mono mt-4" style={{ color: kpi.color }}>
                  {kpi.prefix}{Math.round(count).toLocaleString("en-US")}{kpi.suffix}
                </p>
              </div>
            </Sequence>
          );
        })}
      </div>
    </div>
  );
};
```

### Ejemplo con datos del portafolio

```tsx
<Composition
  id="DataDashboard"
  component={DataDashboard}
  durationInFrames={180}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: "Mission Control",
    period: "Junio 2026",
    kpis: [
      { label: "MRR", value: 13200, prefix: "$", suffix: "", color: "#39d353" },
      { label: "USUARIOS", value: 3257, color: "#58a6ff" },
      { label: "PROYECTOS", value: 8, color: "#bc8cff" },
      { label: "UPTIME", value: 99.7, suffix: "%", color: "#f0c000" },
    ],
  }}
/>
```

---

## Template 03: Product Demo

Screenshots de producto con transiciones y texto explicativo. Ideal para explainer videos.

### Composicion

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Img, staticFile } from "remotion";

interface Slide {
  image: string;
  title: string;
  description: string;
}

interface ProductDemoProps {
  slides: Slide[];
  brandName: string;
  brandColor?: string;
}

export const ProductDemo: React.FC<ProductDemoProps> = ({
  slides,
  brandName,
  brandColor = "#bc8cff",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const framesPerSlide = Math.floor(durationInFrames / slides.length);

  const currentSlideIndex = Math.min(
    Math.floor(frame / framesPerSlide),
    slides.length - 1
  );
  const slide = slides[currentSlideIndex];
  const localFrame = frame - currentSlideIndex * framesPerSlide;

  const imgScale = interpolate(localFrame, [0, framesPerSlide], [1, 1.05], {
    extrapolateRight: "clamp",
  });
  const textOpacity = spring({ frame: localFrame, fps, config: { damping: 12 } });
  const textY = interpolate(textOpacity, [0, 1], [20, 0]);

  return (
    <div className="w-full h-full bg-[#070b0f] relative overflow-hidden">
      {/* Screenshot */}
      <div className="absolute inset-0 flex items-center justify-center p-16">
        <Img
          src={staticFile(slide.image)}
          className="rounded-xl shadow-2xl border border-[#1a2332]"
          style={{ transform: `scale(${imgScale})`, maxHeight: "70%" }}
        />
      </div>

      {/* Text overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 p-12"
        style={{
          background: "linear-gradient(transparent, rgba(7,11,15,0.95))",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <h2 className="text-4xl font-bold text-white font-mono">{slide.title}</h2>
        <p className="text-xl text-[#6e7b8b] mt-2 font-mono">{slide.description}</p>
      </div>

      {/* Brand watermark */}
      <div className="absolute top-8 right-8">
        <span className="text-sm font-bold font-mono tracking-widest" style={{ color: brandColor }}>
          {brandName}
        </span>
      </div>
    </div>
  );
};
```

---

## Template 04: Custom

Cuando el usuario describe algo que no encaja en los templates anteriores:

1. **Preguntar**: resolucion (1920x1080, 1080x1920, 1080x1080), duracion, fps
2. **Definir props** con tipos TypeScript
3. **Crear composicion** usando los hooks de `use-animation.ts`
4. **Registrar** en Root
5. **Preview** con Player
6. **Render** con CLI

---

## Formatos de Output

| Formato | Codec | Comando |
|---------|-------|---------|
| MP4 | H.264 | `--codec h264` (default) |
| WebM | VP8 | `--codec vp8` |
| GIF | gif | `--codec gif --every-nth-frame 2` |
| PNG seq | png | `--image-format png --sequence` |
| Still | png | `npx remotion still` |

## Resoluciones Comunes

| Plataforma | Resolucion | Ratio |
|-----------|------------|-------|
| YouTube/Web | 1920x1080 | 16:9 |
| TikTok/Reels | 1080x1920 | 9:16 |
| Instagram Post | 1080x1080 | 1:1 |
| Twitter/X | 1280x720 | 16:9 |
| Thumbnail | 1280x720 | 16:9 |

---

## Troubleshooting

| Problema | Solucion |
|----------|----------|
| Chrome no encontrado | Instalar Chrome/Chromium o setear `REMOTION_CHROME_EXECUTABLE` |
| Out of memory en render | Usar `--concurrency=1` para reducir uso de RAM |
| Tailwind no aplica | Verificar que `@remotion/tailwind` este configurado en webpack override |
| Fonts no cargan | Usar `@remotion/google-fonts` o `staticFile()` para fonts locales |
| Video sin audio | Agregar `<Audio src={staticFile("audio.mp3")} />` dentro de la composicion |
| Render lento | Reducir `--concurrency`, usar `--gl=angle` en Windows |

---

## Checklist Pre-Delivery

- [ ] Composicion renderiza sin errores en preview
- [ ] Props tipados con TypeScript (no `any`)
- [ ] Player embedded con `controls` y `loop`
- [ ] Duracion y fps correctos para la plataforma destino
- [ ] Assets en `public/` referenciados con `staticFile()`
- [ ] Output path en `public/videos/` o la ruta que pida el usuario
