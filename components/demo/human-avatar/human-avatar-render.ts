type HumanAvatarProps = {
  ctx: CanvasRenderingContext2D;
  mouthScale: number;
  eyeScale: number;
  color?: string;
  gender?: 'male' | 'female';
  isTalking?: boolean;
};

const drawRealisticEye = (
  ctx: CanvasRenderingContext2D,
  pos: [number, number],
  radius: number,
  scaleY: number,
  gender: 'male' | 'female'
) => {
  ctx.save();
  ctx.translate(pos[0], pos[1]);
  
  // Eye socket shadow
  const socketGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.5);
  socketGradient.addColorStop(0, 'rgba(0,0,0,0)');
  socketGradient.addColorStop(1, gender === 'male' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)');
  ctx.fillStyle = socketGradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.5, radius * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye white with realistic shape
  ctx.fillStyle = '#f8f8f8';
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * (gender === 'male' ? 1.2 : 1.3), radius * (gender === 'male' ? 0.8 : 0.9), 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye white shading
  const whiteGradient = ctx.createLinearGradient(0, -radius, 0, radius);
  whiteGradient.addColorStop(0, 'rgba(200,200,200,0.3)');
  whiteGradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = whiteGradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * (gender === 'male' ? 1.2 : 1.3), radius * (gender === 'male' ? 0.8 : 0.9), 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Iris with realistic colors
  const irisColors = {
    male: ['#1a3d1a', '#0d2b0d', '#051a05'],
    female: ['#4a7c8a', '#2d5a6b', '#1a3d47']
  };
  
  const colors = irisColors[gender];
  const irisGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.8);
  irisGradient.addColorStop(0, colors[2]);
  irisGradient.addColorStop(0.3, colors[1]);
  irisGradient.addColorStop(1, colors[0]);
  
  ctx.fillStyle = irisGradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.8, radius * 0.8 * scaleY, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Iris texture lines
  ctx.strokeStyle = colors[2];
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * radius * 0.3, Math.sin(angle) * radius * 0.3);
    ctx.lineTo(Math.cos(angle) * radius * 0.7, Math.sin(angle) * radius * 0.7);
    ctx.stroke();
  }
  
  // Pupil
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.35, radius * 0.35 * scaleY, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Multiple eye highlights for realism
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.ellipse(-radius * 0.15, -radius * 0.2, radius * 0.2, radius * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(radius * 0.2, -radius * 0.1, radius * 0.1, radius * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Upper eyelid
  ctx.strokeStyle = gender === 'male' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.3)';
  ctx.lineWidth = gender === 'male' ? 3 : 2;
  ctx.beginPath();
  ctx.ellipse(0, -radius * 0.1, radius * (gender === 'male' ? 1.2 : 1.3), radius * 0.7, 0, 0, Math.PI);
  ctx.stroke();
  
  // Lower eyelid
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.1, radius * (gender === 'male' ? 1.1 : 1.2), radius * 0.5, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  
  // Eyelashes
  ctx.strokeStyle = gender === 'female' ? '#2c1810' : '#1c1c1c';
  ctx.lineWidth = gender === 'female' ? 2 : 1;
  ctx.lineCap = 'round';
  
  for (let i = -3; i <= 3; i++) {
    const x = i * radius * 0.25;
    const length = gender === 'female' ? radius * 0.4 : radius * 0.15;
    const curve = Math.abs(i) * 0.1;
    
    // Upper lashes
    ctx.beginPath();
    ctx.moveTo(x, -radius * 0.8);
    ctx.lineTo(x + curve, -radius * 0.8 - length);
    ctx.stroke();
    
    if (gender === 'female' && Math.abs(i) <= 2) {
      // Lower lashes for female
      ctx.beginPath();
      ctx.moveTo(x, radius * 0.6);
      ctx.lineTo(x - curve * 0.5, radius * 0.6 + length * 0.3);
      ctx.stroke();
    }
  }
  
  ctx.restore();
};

const drawRealisticHair = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gender: 'male' | 'female'
) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width / 2 - 20;
  
  if (gender === 'female') {
    // Female hair - long and flowing
    const hairGradient = ctx.createLinearGradient(0, centerY - radius, 0, centerY + radius);
    hairGradient.addColorStop(0, '#8B4513');
    hairGradient.addColorStop(0.5, '#A0522D');
    hairGradient.addColorStop(1, '#654321');
    ctx.fillStyle = hairGradient;
    
    // Main hair shape
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - radius * 0.2, radius * 1.3, radius * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair layers for depth
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.ellipse(centerX - radius * 0.3, centerY - radius * 0.1, radius * 0.8, radius * 1.2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(centerX + radius * 0.3, centerY - radius * 0.1, radius * 0.8, radius * 1.2, 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair strands
    ctx.strokeStyle = '#4A2C17';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const startX = centerX + Math.cos(angle) * radius * 0.9;
      const startY = centerY - radius * 0.2 + Math.sin(angle) * radius * 0.9;
      const endX = centerX + Math.cos(angle) * radius * 1.4;
      const endY = centerY - radius * 0.2 + Math.sin(angle) * radius * 1.4;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        startX + Math.cos(angle + 0.5) * radius * 0.3,
        startY + Math.sin(angle + 0.5) * radius * 0.3,
        endX, endY
      );
      ctx.stroke();
    }
    
    // Hair highlights
    ctx.strokeStyle = '#CD853F';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const startX = centerX + Math.cos(angle) * radius * 0.7;
      const startY = centerY - radius * 0.3 + Math.sin(angle) * radius * 0.7;
      const endX = centerX + Math.cos(angle) * radius * 1.1;
      const endY = centerY - radius * 0.3 + Math.sin(angle) * radius * 1.1;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  } else {
    // Male hair - military buzz cut
    const hairGradient = ctx.createLinearGradient(0, centerY - radius, 0, centerY);
    hairGradient.addColorStop(0, '#2C2C2C');
    hairGradient.addColorStop(1, '#1A1A1A');
    ctx.fillStyle = hairGradient;
    
    // Very short military cut
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - radius * 0.45, radius * 0.95, radius * 0.6, 0, 0, Math.PI);
    ctx.fill();
    
    // Buzz cut texture - very short stubble
    ctx.fillStyle = '#0F0F0F';
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI;
      const distance = Math.random() * radius * 0.9;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY - radius * 0.45 + Math.sin(angle) * distance * 0.6;
      
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Military-style sideburns - very short
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.ellipse(centerX - radius * 0.85, centerY - radius * 0.2, radius * 0.08, radius * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(centerX + radius * 0.85, centerY - radius * 0.2, radius * 0.08, radius * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawRealisticNose = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number
) => {
  // Nose bridge shadow
  const bridgeGradient = ctx.createLinearGradient(centerX - size * 0.1, centerY - size * 0.4, centerX + size * 0.1, centerY - size * 0.4);
  bridgeGradient.addColorStop(0, 'rgba(0,0,0,0.1)');
  bridgeGradient.addColorStop(0.5, 'rgba(0,0,0,0.05)');
  bridgeGradient.addColorStop(1, 'rgba(0,0,0,0.1)');
  
  ctx.fillStyle = bridgeGradient;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - size * 0.1, size * 0.15, size * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose tip highlight
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Nostrils
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(centerX - size * 0.15, centerY + size * 0.05, size * 0.06, size * 0.04, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(centerX + size * 0.15, centerY + size * 0.05, size * 0.06, size * 0.04, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose outline
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - size * 0.3);
  ctx.quadraticCurveTo(centerX - size * 0.1, centerY - size * 0.1, centerX - size * 0.2, centerY + size * 0.1);
  ctx.moveTo(centerX, centerY - size * 0.3);
  ctx.quadraticCurveTo(centerX + size * 0.1, centerY - size * 0.1, centerX + size * 0.2, centerY + size * 0.1);
  ctx.stroke();
};

const drawRealisticEyebrows = (
  ctx: CanvasRenderingContext2D,
  leftEyePos: [number, number],
  rightEyePos: [number, number],
  size: number,
  gender: 'male' | 'female'
) => {
  const browColor = gender === 'female' ? '#654321' : '#2c2c2c';
  const browThickness = gender === 'female' ? 2 : 4;
  
  ctx.strokeStyle = browColor;
  ctx.lineWidth = browThickness;
  ctx.lineCap = 'round';
  
  // Left eyebrow with individual hairs
  for (let i = 0; i < (gender === 'female' ? 8 : 10); i++) {
    const progress = i / 7;
    const startX = leftEyePos[0] - size * 0.9 + progress * size * 1.6;
    // Raised eyebrows with angry angle - higher position and steeper angle
    const startY = leftEyePos[1] - size * (gender === 'female' ? 1.1 : 1.3) + Math.sin(progress * Math.PI) * size * (gender === 'female' ? 0.2 : 0.1);
    const angle = gender === 'female' ? (-0.3 + progress * 0.6) : (-0.8 + progress * 1.2); // Much steeper angle for anger
    const length = size * (0.15 + Math.sin(progress * Math.PI) * 0.1);
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
    ctx.stroke();
  }
  
  // Right eyebrow with individual hairs
  for (let i = 0; i < (gender === 'female' ? 8 : 10); i++) {
    const progress = i / 7;
    const startX = rightEyePos[0] - size * 0.7 + progress * size * 1.6;
    // Raised eyebrows with angry angle - higher position and steeper angle
    const startY = rightEyePos[1] - size * (gender === 'female' ? 1.1 : 1.3) + Math.sin(progress * Math.PI) * size * (gender === 'female' ? 0.2 : 0.1);
    const angle = gender === 'female' ? (-2.8 + progress * 0.6) : (-2.0 + progress * -1.2); // Opposite steep angle for anger
    const length = size * (0.15 + Math.sin(progress * Math.PI) * 0.1);
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
    ctx.stroke();
  }
  
  // Add deeper angry frown lines for male
  if (gender === 'male') {
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; // Darker frown lines
    ctx.lineWidth = 3; // Thicker lines
    
    // Deeper vertical frown lines between eyebrows
    ctx.beginPath();
    ctx.moveTo(leftEyePos[0] + size * 0.6, leftEyePos[1] - size * 1.0);
    ctx.lineTo(leftEyePos[0] + size * 0.6, leftEyePos[1] - size * 0.2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(rightEyePos[0] - size * 0.6, rightEyePos[1] - size * 1.0);
    ctx.lineTo(rightEyePos[0] - size * 0.6, rightEyePos[1] - size * 0.2);
    ctx.stroke();
    
    // Add horizontal forehead wrinkles for extra anger
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 3; i++) {
      const y = leftEyePos[1] - size * (1.4 + i * 0.2);
      ctx.beginPath();
      ctx.moveTo(leftEyePos[0] - size * 0.3, y);
      ctx.lineTo(rightEyePos[0] + size * 0.3, y);
      ctx.stroke();
    }
    
    // Add crow's feet wrinkles around eyes for intensity
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    
    // Left eye crow's feet
    for (let i = 0; i < 3; i++) {
      const angle = -0.5 + i * 0.3;
      ctx.beginPath();
      ctx.moveTo(leftEyePos[0] - size * 1.2, leftEyePos[1] + Math.sin(angle) * size * 0.3);
      ctx.lineTo(leftEyePos[0] - size * 1.5, leftEyePos[1] + Math.sin(angle) * size * 0.5);
      ctx.stroke();
    }
    
    // Right eye crow's feet
    for (let i = 0; i < 3; i++) {
      const angle = 0.5 + i * 0.3;
      ctx.beginPath();
      ctx.moveTo(rightEyePos[0] + size * 1.2, rightEyePos[1] + Math.sin(angle) * size * 0.3);
      ctx.lineTo(rightEyePos[0] + size * 1.5, rightEyePos[1] + Math.sin(angle) * size * 0.5);
      ctx.stroke();
    }
  }
};

const drawFacialStructure = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) => {
  // Cheekbones
  const cheekGradient = ctx.createRadialGradient(centerX - radius * 0.4, centerY, 0, centerX - radius * 0.4, centerY, radius * 0.3);
  cheekGradient.addColorStop(0, 'rgba(0,0,0,0.05)');
  cheekGradient.addColorStop(1, 'rgba(0,0,0,0)');
  
  ctx.fillStyle = cheekGradient;
  ctx.beginPath();
  ctx.ellipse(centerX - radius * 0.4, centerY, radius * 0.3, radius * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(centerX + radius * 0.4, centerY, radius * 0.3, radius * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Jawline shadow
  const jawGradient = ctx.createLinearGradient(centerX, centerY + radius * 0.3, centerX, centerY + radius * 0.8);
  jawGradient.addColorStop(0, 'rgba(0,0,0,0)');
  jawGradient.addColorStop(1, 'rgba(0,0,0,0.1)');
  
  ctx.fillStyle = jawGradient;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + radius * 0.2, radius * 0.8, radius * 0.6, 0, 0, Math.PI);
  ctx.fill();
  
  // Forehead highlight
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - radius * 0.3, radius * 0.6, radius * 0.3, 0, 0, Math.PI);
  ctx.fill();
};

export function renderHumanAvatar(props: HumanAvatarProps) {
  const {
    ctx,
    eyeScale: eyesOpenness,
    mouthScale: mouthOpenness,
    color,
    gender = 'male',
    isTalking = false,
  } = props;
  const { width, height } = ctx.canvas;

  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const faceRadius = width / 2 - 20;

  // Draw military camouflage background for male
  if (gender === 'male') {
    // Camouflage pattern
    const camColors = ['#4A5D23', '#6B7C32', '#8B9A46', '#3A4A1A'];
    
    // Fill background with base camo color
    ctx.fillStyle = camColors[0];
    ctx.fillRect(0, 0, width, height);
    
    // Add camo spots
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 20 + Math.random() * 40;
      const colorIndex = Math.floor(Math.random() * camColors.length);
      
      ctx.fillStyle = camColors[colorIndex];
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add smaller camo details
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 5 + Math.random() * 15;
      const colorIndex = Math.floor(Math.random() * camColors.length);
      
      ctx.fillStyle = camColors[colorIndex];
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Draw hair first (behind face)
  drawRealisticHair(ctx, width, height, gender);

  // Draw the face with realistic skin tone
  const skinGradient = ctx.createRadialGradient(
    centerX - faceRadius * 0.3,
    centerY - faceRadius * 0.3,
    0,
    centerX,
    centerY,
    faceRadius
  );
  if (gender === 'male') {
    // More masculine, tanned skin tone
    skinGradient.addColorStop(0, '#D4A574');
    skinGradient.addColorStop(0.7, '#C19660');
    skinGradient.addColorStop(1, '#A67C52');
  } else {
    skinGradient.addColorStop(0, '#FDBCB4');
    skinGradient.addColorStop(0.7, '#F5A99B');
    skinGradient.addColorStop(1, '#E8967A');
  }
  
  ctx.fillStyle = skinGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, faceRadius, 0, Math.PI * 2);
  ctx.fill();

  // Add facial scars for male (military look)
  if (gender === 'male') {
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Small scar on left cheek
    ctx.beginPath();
    ctx.moveTo(centerX - faceRadius * 0.3, centerY + faceRadius * 0.1);
    ctx.lineTo(centerX - faceRadius * 0.2, centerY + faceRadius * 0.2);
    ctx.stroke();
    
    // Scar on forehead
    ctx.beginPath();
    ctx.moveTo(centerX + faceRadius * 0.1, centerY - faceRadius * 0.4);
    ctx.lineTo(centerX + faceRadius * 0.3, centerY - faceRadius * 0.3);
    ctx.stroke();
  }
  // Add facial structure
  drawFacialStructure(ctx, centerX, centerY, faceRadius);

  // Eye positions
  const eyesCenter = [centerX, centerY - faceRadius * 0.15];
  const eyesOffset = faceRadius * 0.28;
  const eyeRadius = faceRadius * 0.1;
  const eyesPosition: Array<[number, number]> = [
    [eyesCenter[0] - eyesOffset, eyesCenter[1]],
    [eyesCenter[0] + eyesOffset, eyesCenter[1]],
  ];

  // Draw eyebrows
  drawRealisticEyebrows(ctx, eyesPosition[0], eyesPosition[1], eyeRadius, gender);

  // Draw the eyes
  drawRealisticEye(ctx, eyesPosition[0], eyeRadius, eyesOpenness + 0.1, gender);
  drawRealisticEye(ctx, eyesPosition[1], eyeRadius, eyesOpenness + 0.1, gender);

  // Draw nose
  drawRealisticNose(ctx, centerX, centerY, faceRadius * 0.12);

  // Draw the mouth with more realism
  const mouthCenter = [centerX, centerY + faceRadius * 0.35];
  const mouthWidth = faceRadius * 0.22;
  const mouthHeight = Math.max(3, mouthOpenness * faceRadius * 0.12);

  ctx.save();
  ctx.translate(mouthCenter[0], mouthCenter[1]);

  if (isTalking && mouthOpenness > 0.1) {
    // Open mouth when talking
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.ellipse(0, 0, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner mouth shadow
    ctx.fillStyle = '#4A0000';
    ctx.beginPath();
    ctx.ellipse(0, mouthHeight * 0.3, mouthWidth * 0.8, mouthHeight * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Teeth
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, -mouthHeight * 0.2, mouthWidth * 0.9, mouthHeight * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Individual teeth
    ctx.strokeStyle = 'rgba(200,200,200,0.5)';
    ctx.lineWidth = 1;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * mouthWidth * 0.15, -mouthHeight * 0.35);
      ctx.lineTo(i * mouthWidth * 0.15, -mouthHeight * 0.05);
      ctx.stroke();
    }
    
    // Tongue
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.ellipse(0, mouthHeight * 0.1, mouthWidth * 0.6, mouthHeight * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Closed mouth - realistic lips
    const lipGradient = ctx.createLinearGradient(0, -mouthWidth * 0.3, 0, mouthWidth * 0.3);
    if (gender === 'male') {
      // More masculine, less colorful lips
      lipGradient.addColorStop(0, '#A0756B');
      lipGradient.addColorStop(0.5, '#8B5A4A');
      lipGradient.addColorStop(1, '#6B4A3A');
    } else {
      lipGradient.addColorStop(0, '#CD5C5C');
      lipGradient.addColorStop(0.5, '#B22222');
      lipGradient.addColorStop(1, '#8B0000');
    }
    
    ctx.fillStyle = lipGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, mouthWidth, mouthWidth * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Lip highlight
    ctx.fillStyle = gender === 'male' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, -mouthWidth * 0.1, mouthWidth * 0.8, mouthWidth * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Lip line
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-mouthWidth, 0);
    ctx.quadraticCurveTo(0, mouthWidth * 0.1, mouthWidth, 0);
    ctx.stroke();
  }

  ctx.restore();

  // Add 5 o'clock shadow for male
  if (gender === 'male') {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    
    // Jaw area shadow
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + faceRadius * 0.4, faceRadius * 0.7, faceRadius * 0.3, 0, 0, Math.PI);
    ctx.fill();
    
    // Upper lip shadow
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + faceRadius * 0.25, faceRadius * 0.25, faceRadius * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Chin shadow
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + faceRadius * 0.6, faceRadius * 0.4, faceRadius * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Add realistic cheek coloring
  if (gender === 'female') {
    ctx.fillStyle = 'rgba(255, 182, 193, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX - faceRadius * 0.45, centerY + faceRadius * 0.1, faceRadius * 0.12, faceRadius * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + faceRadius * 0.45, centerY + faceRadius * 0.1, faceRadius * 0.12, faceRadius * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add subtle face contour
  const contourGradient = ctx.createRadialGradient(centerX, centerY, faceRadius * 0.7, centerX, centerY, faceRadius);
  contourGradient.addColorStop(0, 'rgba(0,0,0,0)');
  contourGradient.addColorStop(1, gender === 'male' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.08)');
  
  ctx.fillStyle = contourGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, faceRadius, 0, Math.PI * 2);
  ctx.fill();
}