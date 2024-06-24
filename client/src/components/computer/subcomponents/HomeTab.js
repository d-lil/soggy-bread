import React from "react";
import { useEffect, useRef, useState } from "react";
import "../css/Internet.css";
import bushBackground from "../assets/bush.jpg";
import bushBackground2 from "../assets/bush2.jpg";

const Paint = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(5);
    const [brushShape, setBrushShape] = useState("round");
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const img = new Image();
      img.src = bushBackground2;
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }, [bushBackground2]);
  
    const startDrawing = (e) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    };
  
    const draw = (e) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.lineCap = brushShape;
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    };
  
    const stopDrawing = () => {
      setIsDrawing(false);
    };
  
    const clearCanvas = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const img = new Image();
      img.src = bushBackground2;
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };
  
    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#000000", "#FFFFFF", "#808080"];
    const brushShapes = ["round", "square"];
  
    return (
      <div className="paint-container">
        <div className="paint-controls">
          <div className="color-palette">
            {colors.map((col) => (
              <button
                key={col}
                className="color-button"
                style={{ backgroundColor: col }}
                onClick={() => setColor(col)}
              />
            ))}
          </div>
          <br/>
          <div className="paint-controls-lower">
          <label htmlFor="brushSize">Brush Size:</label>
          <input
            type="number"
            id="brushSize"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
          />
          <div className="brush-shapes">
            {brushShapes.map((shape) => (
              <button
                key={shape}
                className={`brush-shape-button ${brushShape === shape ? 'active' : ''}`}
                onClick={() => setBrushShape(shape)}
              >
                {shape}
              </button>
            ))}
          </div>
          <button onClick={clearCanvas}>Clear</button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={400}
          height={350}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="paint-canvas"
        />
      </div>
    );
  };


const HomeTab = () => {
    return (
        <div className="home-tab">
            <div className="home-tab-content">
            <div className="home-tab-header">

            <h1>Welcome to the <span className="header-font">INTERNET</span></h1>
            </div>
            <div className="home-tab-body">
                <Paint />
                <div className="paint-instructions">
                <h3>Click and drag to paint on Mr. Bush!</h3>
                </div>
                </div>
            </div>
        </div>
    );
}

export default HomeTab;