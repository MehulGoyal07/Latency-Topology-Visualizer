
# 🌐 Latency Topology Visualizer

![Main Interface](https://raw.githubusercontent.com/MehulGoyal07/Latency-Topology-Visualizer/main/public/demo.png)
*Interactive 3D visualization of global exchange servers and cloud latency*

---

## 🚀 Live Demo  
[![Live Demo Button](https://img.shields.io/badge/View-Live_Demo-2ea44f?style=for-the-badge)](https://latency-topology-visualizer-x9r7.vercel.app/)

---

## 📌 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#-technology-stack)
- [💻 Installation Guide](#-installation-guide)
- [⚙️ Configuration](#-configuration)
- [👨‍💻 Development](#-development)
- [⚡ Performance Metrics](#-performance-metrics)
- [🏗️ Architecture](#-architecture)
- [🧪 Testing](#-testing)
- [🗺️ Roadmap](#-roadmap)
- [❓ FAQs](#-faqs)
- [📸 Screenshots](#-screenshots)

---

## ✨ Key Features

### 🌍 Core Visualization
| Feature | Description |
|--------|-------------|
| **3D World Map** | Interactive globe with zoom/rotate/pan controls |
| **Exchange Markers** | Color-coded AWS/GCP/Azure servers with tooltips |
| **Latency Connections** | Animated lines showing real-time network performance |
| **Cloud Regions** | Visual boundaries of provider coverage areas |

### 📊 Analytics
- Real-time latency monitoring
- Historical data trends (1h/24h/7d)
- Statistical breakdowns (min/max/avg)
- Provider comparison tools

---

## 🛠️ Technology Stack

### Frontend
| Technology           | Purpose             |
|----------------------|---------------------|
| Next.js 14           | React Framework     |
| Three.js             | 3D Rendering        |
| React Three Fiber    | Three.js Integration|
| CSS         | Styling             |
| Chart.js             | Data Visualization  |

### Backend
- Mock API Service
- Vercel Edge Functions
- SWR Data Fetching

---

## 💻 Installation Guide

### Prerequisites
- Node.js ≥ 18.x  
- npm ≥ 9.x  
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/MehulGoyal07/Latency-Topology-Visualizer
cd latency-visualizer

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start development server
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

```ini
NEXT_PUBLIC_CLOUDFLARE_API_KEY=your_token
NEXT_PUBLIC_MOCK_API=false
```
---

## 👨‍💻 Development

### Project Structure

```
src/
├── components/
│   ├── map/       # 3D globe components
│   └── ui/        # UI controls
├── lib/
│   ├── data/      # Mock datasets
└── pages/         # Next.js routes
```

### Common Commands

```bash
npm run build   # Production build
npm run lint    # Code quality check
npm run format  # Auto-format code
```

---

## ⚡ Performance Metrics

| Scenario | Load Time | FPS |
|----------|-----------|-----|
| Desktop  | 1.2s      | 60  |
| Mobile   | 1.8s      | 30  |
| Low-end  | 2.4s      | 15  |

**Optimization Techniques:**
- Dynamic quality adjustment
- Selective re-rendering
- GPU instancing

---

## 🏗️ Architecture

- Data Flow
- Modular Code Structure

---

## 🧪 Testing

### Test Coverage

| Module            | Coverage |
|-------------------|----------|
| Map Interactions  | 92%      |
| Data Fetching     | 88%      |
| Mobile Rendering  | 85%      |

### Run Tests

```bash
npm test
```

---

## 🗺️ Roadmap

### Q3 2024
- Latency heatmaps
- Network topology views

### Q4 2024
- Custom region definitions
- Alerting system

---

## ❓ FAQs

**Q: How accurate is the latency data?**  
A: The demo uses simulated data. Connect to real APIs for production accuracy.

**Q: Can I add custom locations?**  
A: Yes! Edit `src/lib/data/exchanges.ts`

**Q: Mobile performance tips?**  
A: Reduce quality settings in the config file for better performance

---

## 📸 Screenshots

| Description       | Preview |
|-------------------|---------|
| Main Interface    | ![Main Interface](https://raw.githubusercontent.com/MehulGoyal07/Latency-Topology-Visualizer/main/public/demo.png) |
| Analytics Panel   | ![Analytics Panel](https://raw.githubusercontent.com/MehulGoyal07/Latency-Topology-Visualizer/main/public/analyticspanel.png) |
| Mobile Layout     | ![Mobile Layout](https://raw.githubusercontent.com/MehulGoyal07/Latency-Topology-Visualizer/main/public/mobile.png) |
