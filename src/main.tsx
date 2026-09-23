import React from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import './index.css';

import { CustomizerAppOverlay } from './customizer/CustomizerAppOverlay';
import { initMobilePerformanceOptimizer } from './utils/mobilePerformanceOptimizer';
import { LanguageProvider } from './i18n/LanguageContext';

(window as unknown as { THREE: typeof THREE }).THREE = THREE;

// Start Anti-Lag Mobile / Tablet Performance Engine
initMobilePerformanceOptimizer();

function mountCustomizer() {
  const portalEl = document.getElementById('customizer-portal');
  if (portalEl && !portalEl.hasChildNodes()) {
    const root = ReactDOM.createRoot(portalEl);
    root.render(
      <React.StrictMode>
        <LanguageProvider>
          <CustomizerAppOverlay />
        </LanguageProvider>
      </React.StrictMode>
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountCustomizer, { once: true });
} else {
  mountCustomizer();
}

