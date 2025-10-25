import React, { useState } from 'react';
import './SizeController.css';

const SizeController = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customWidth, setCustomWidth] = useState(1200);
  const [customHeight, setCustomHeight] = useState(2100);

  const presets = [
    { name: 'Default', width: 1200, height: 2100 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Mobile', width: 375, height: 812 },
  ];

  const applySize = (width, height) => {
    document.documentElement.style.setProperty('--mirror-width', `${width}px`);
    document.documentElement.style.setProperty('--mirror-height', `${height}px`);
    setCustomWidth(width);
    setCustomHeight(height);
  };

  const handlePreset = (preset) => {
    applySize(preset.width, preset.height);
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    applySize(customWidth, customHeight);
  };

  const resetToDefault = () => {
    applySize(1200, 2100);
    setIsOpen(false);
  };

  return (
    <div className="size-controller">
      <button 
        className="size-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle size controller"
        title="Adjust Display Size"
      >
        📐
      </button>
      
      {isOpen && (
        <div className="size-menu">
          <div className="size-menu-header">Display Size</div>
          
          <div className="size-presets">
            {presets.map((preset) => (
              <button
                key={preset.name}
                className="size-preset-btn"
                onClick={() => handlePreset(preset)}
              >
                <span className="preset-name">{preset.name}</span>
                <span className="preset-dims">{preset.width}×{preset.height}</span>
              </button>
            ))}
          </div>

          <div className="size-divider"></div>

          <div className="size-custom">
            <div className="custom-label">Custom Size</div>
            <div className="custom-inputs">
              <div className="input-group">
                <label>Width</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  min="200"
                  max="3840"
                />
              </div>
              <div className="input-group">
                <label>Height</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                  min="400"
                  max="4000"
                />
              </div>
            </div>
            <button className="apply-btn" onClick={handleCustomApply}>
              Apply Custom
            </button>
          </div>

          <div className="size-divider"></div>

          <button className="reset-btn" onClick={resetToDefault}>
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
};

export default SizeController;
