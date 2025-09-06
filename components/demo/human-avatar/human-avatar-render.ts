type HumanAvatarProps = {
  ctx: CanvasRenderingContext2D;
  mouthScale: number;
  eyeScale: number;
  color?: string;
  gender?: 'male' | 'female';
  isTalking?: boolean;
};

const drawEye = (
  ctx: CanvasRenderingContext2D,
  pos: [number, number],
  radius: number,
  scaleY: number,
  gender: 'male' | 'female'
) => {
  ctx.save();
  ctx.translate(pos[0], pos[1]);
  
  // Eye white
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.2, radius * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Iris
  ctx.fillStyle = gender === 'female' ? '#4a90e2' : '#2c5530';
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.7, radius * 0.7 * scaleY, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Pupil
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.3, radius * 0.3 * scaleY, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye highlight
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(-radius * 0.1, -radius * 0.1, radius * 0.15, radius * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyelashes for female
  if (gender === 'female') {
    ctx.strokeStyle = '#2c2c2c';
    ctx.lineWidth = 2;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * radius * 0.2, -radius * 0.8);
      ctx.lineTo(i * radius * 0.25, -radius * 1.1);
      ctx.stroke();
    }
  }
  
  ctx.restore();
};

const drawHair = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gender: 'male' | 'female'
) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width / 2 - 20;
  
  ctx.fillStyle = gender === 'female' ? '#8B4513' : '#4A4A4A';
  
  if (gender === 'female') {
    // Long hair for female
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - radius * 0.3, radius * 1.2, radius * 1.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair strands
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const startX = centerX + Math.cos(angle) * radius * 0.8;
      const startY = centerY - radius * 0.3 + Math.sin(angle) * radius * 0.8;
      const endX = centerX + Math.cos(angle) * radius * 1.3;
      const endY = centerY - radius * 0.3 + Math.sin(angle) * radius * 1.3;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  } else {
    // Short hair for male
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - radius * 0.4, radius * 0.9, radius * 0.6, 0, 0, Math.PI);
    ctx.fill();
  }
};

const drawNose = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number
) => {
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - size * 0.3);
  ctx.lineTo(centerX - size * 0.2, centerY + size * 0.1);
  ctx.moveTo(centerX, centerY + size * 0.1);
  ctx.lineTo(centerX + size * 0.2, centerY + size * 0.1);
  ctx.stroke();
};

const drawEyebrows = (
  ctx: CanvasRenderingContext2D,
  leftEyePos: [number, number],
  rightEyePos: [number, number],
  size: number,
  gender: 'male' | 'female'
) => {
  ctx.strokeStyle = gender === 'female' ? '#654321' : '#2c2c2c';
  ctx.lineWidth = gender === 'female' ? 3 : 4;
  ctx.lineCap = 'round';
  
  // Left eyebrow
  ctx.beginPath();
  ctx.moveTo(leftEyePos[0] - size * 0.8, leftEyePos[1] - size * 0.8);
  ctx.lineTo(leftEyePos[0] + size * 0.8, leftEyePos[1] - size * 0.6);
  ctx.stroke();
  
  // Right eyebrow
  ctx.beginPath();
  ctx.moveTo(rightEyePos[0] - size * 0.8, rightEyePos[1] - size * 0.6);
  ctx.lineTo(rightEyePos[0] + size * 0.8, rightEyePos[1] - size * 0.8);
  ctx.stroke();
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

  // Draw hair first (behind face)
  drawHair(ctx, width, height, gender);

  // Draw the face
  ctx.fillStyle = '#FDBCB4'; // Skin color
  ctx.beginPath();
  ctx.arc(centerX, centerY, faceRadius, 0, Math.PI * 2);
  ctx.fill();

  // Add face shading
  const gradient = ctx.createRadialGradient(
    centerX - faceRadius * 0.3,
    centerY - faceRadius * 0.3,
    0,
    centerX,
    centerY,
    faceRadius
  );
  gradient.addColorStop(0, 'rgba(253, 188, 180, 0)');
  gradient.addColorStop(1, 'rgba(200, 150, 140, 0.3)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, faceRadius, 0, Math.PI * 2);
  ctx.fill();

  // Eye positions
  const eyesCenter = [centerX, centerY - faceRadius * 0.2];
  const eyesOffset = faceRadius * 0.3;
  const eyeRadius = faceRadius * 0.12;
  const eyesPosition: Array<[number, number]> = [
    [eyesCenter[0] - eyesOffset, eyesCenter[1]],
    [eyesCenter[0] + eyesOffset, eyesCenter[1]],
  ];

  // Draw eyebrows
  drawEyebrows(ctx, eyesPosition[0], eyesPosition[1], eyeRadius, gender);

  // Draw the eyes
  drawEye(ctx, eyesPosition[0], eyeRadius, eyesOpenness + 0.1, gender);
  drawEye(ctx, eyesPosition[1], eyeRadius, eyesOpenness + 0.1, gender);

  // Draw nose
  drawNose(ctx, centerX, centerY, faceRadius * 0.15);

  // Draw the mouth
  const mouthCenter = [centerX, centerY + faceRadius * 0.3];
  const mouthWidth = faceRadius * 0.25;
  const mouthHeight = Math.max(5, mouthOpenness * faceRadius * 0.15);

  ctx.save();
  ctx.translate(mouthCenter[0], mouthCenter[1]);

  if (isTalking && mouthOpenness > 0.1) {
    // Open mouth when talking
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.ellipse(0, 0, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Teeth
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(0, -mouthHeight * 0.3, mouthWidth * 0.8, mouthHeight * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Closed mouth - smile
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, mouthWidth, 0, Math.PI);
    ctx.stroke();
  }

  ctx.restore();

  // Add cheek blush for female
  if (gender === 'female') {
    ctx.fillStyle = 'rgba(255, 182, 193, 0.4)';
    ctx.beginPath();
    ctx.ellipse(centerX - faceRadius * 0.5, centerY + faceRadius * 0.1, faceRadius * 0.15, faceRadius * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + faceRadius * 0.5, centerY + faceRadius * 0.1, faceRadius * 0.15, faceRadius * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}