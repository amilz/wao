import React, { useRef, useState, useEffect } from 'react';
import knownImage from '../public/known.png';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const isMobileDevice = () => {
    return (
      typeof window.navigator !== "undefined" &&
      /(Android|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(
        window.navigator.userAgent
      )
    );
  };
  
  useEffect(() => {
    if (isMobileDevice()) {
      window.location.href = "./og";
    }
  }, []);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedImage(event.target.files[0]);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDragging(true);
    setLastMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const dx = event.clientX - lastMousePosition.x;
    const dy = event.clientY - lastMousePosition.y;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleScale = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  const drawProfileImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    if (uploadedImage) {
      const profileImage = new window.Image();
      profileImage.src = URL.createObjectURL(uploadedImage);
      profileImage.onload = () => {
        const size = Math.min(profileImage.width, profileImage.height) * scale;
        const x = (profileImage.width - size) / 2 + position.x;
        const y = (profileImage.height - size) / 2 + position.y;
        ctx.drawImage(profileImage, x, y, size, size);
      };
    }
  
    const knownImg = new window.Image();
    knownImg.src = knownImage.src;
    knownImg.onload = () => {
      ctx.drawImage(knownImg, 0, 0, canvas.width, canvas.height);
    };
  };
  
  
  useEffect(() => {
    drawProfileImage();
  }, [uploadedImage, position, scale]);
  
  const copyImage = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <input type="file" onChange={handleImageUpload} className={styles.input} />
        <label>
          Scale
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.01"
            value={scale}
            onChange={handleScale}
            className={styles.slider}
          />
        </label>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className={styles.canvas}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {uploadedImage && <button className={styles.button} onClick={copyImage}>Copy Image</button>}
      </div>
      <footer className={styles.footer}>
        <a href="https://github.com/amilz/wao" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <span className={styles.separator}> | </span>
        <Link href="/og">
          simple
        </Link>
      </footer>

    </div>
  );
};

export default App;
