import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import knownImage from '../public/known.png';
import styles from '../styles/Home.module.css';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedImage(event.target.files[0]);
    }
  };

  const drawProfileImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (uploadedImage) {
      const profileImage = new window.Image();
      profileImage.src = URL.createObjectURL(uploadedImage);
      profileImage.onload = () => {
        const size = Math.min(profileImage.width, profileImage.height);
        const x = (profileImage.width - size) / 2;
        const y = (profileImage.height - size) / 2;
        ctx.drawImage(profileImage, x, y, size, size, 0, 0, canvas.width, canvas.height);

        const knownImg = new window.Image();
        knownImg.src = knownImage.src;
        knownImg.onload = () => {
          ctx.drawImage(knownImg, 0, 0, canvas.width, canvas.height);
        };
      };
    } else {
      const knownImg = new window.Image();
      knownImg.src = knownImage.src;
      knownImg.onload = () => {
        ctx.drawImage(knownImg, 0, 0, canvas.width, canvas.height);
      };
    }
  };


  useEffect(() => {
    drawProfileImage();
  }, [uploadedImage]);

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
        <canvas ref={canvasRef} width={300} height={300} />
        {uploadedImage && <button className={styles.button} onClick={copyImage}>Copy Image</button>}
      </div>
    </div>
  );
};

export default App;
