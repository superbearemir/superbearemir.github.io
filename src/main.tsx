import React from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import './index.css';

import { CustomizerAppOverlay } from './customizer/CustomizerAppOverlay';

(window as unknown as { THREE: typeof THREE }).THREE = THREE;

const portalEl = document.getElementById('customizer-portal');
if (portalEl) {
  const root = ReactDOM.createRoot(portalEl);
  root.render(
    <React.StrictMode>
      <CustomizerAppOverlay />
    </React.StrictMode>
  );
}

