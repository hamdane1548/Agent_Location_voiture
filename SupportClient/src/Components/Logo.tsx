import { useEffect, useState } from "react";
type LogoProps = {
  width?: string;
  height?: string;
  bgcolor?: string;
  eyescolor?: string;
};
type ObjectMouse = {
  x: number;
  y: number;
};

type Circle = {
  rayon: number;
  centerX: number;
  centerY: number;
};

const calcul_air_cercle = (): Circle => {
  const cercle = document.getElementById("cerclemain");
  const moncercle = cercle?.getBoundingClientRect();

  if (!moncercle) {
    return {
      rayon: 0,
      centerX: 0,
      centerY: 0,
    };
  }

  const rayon = moncercle.width / 2;

  const centerX = moncercle.left + rayon;
  const centerY = moncercle.top + moncercle.height / 2;

  return {
    rayon,
    centerX,
    centerY,
  };
};

const Logo =({width,height,bgcolor,eyescolor}:LogoProps)=>{
    const [rayon, setRayon] = useState<Circle>({
    rayon: 0,
    centerX: 0,
    centerY: 0,
  });

  const [eye1, setEye1] = useState({
    left: 10,
    top: 14,
  });

  const [eye2, setEye2] = useState({
    left: 18,
    top: 14,
  });

  const [mouse, setMouse] = useState<ObjectMouse>({
    x: 0,
    y: 0,
  });

  // Calcul du cercle
  useEffect(() => {
    setRayon(calcul_air_cercle());
  }, []);

  // Position de la souris
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: event.clientX,
        y: event.clientY,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Mouvement des deux yeux
  useEffect(() => {
    if (rayon.rayon === 0) return;

    const dx = mouse.x - rayon.centerX;
    const dy = mouse.y - rayon.centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = rayon.rayon - 4;

    let moveX = dx;
    let moveY = dy;

    if (distance > maxDistance) {
      moveX = (dx / distance) * maxDistance;
      moveY = (dy / distance) * maxDistance;
    }

    // Position centrale du mouvement
    const centerLocalX = rayon.rayon - 4;
    const centerLocalY = rayon.rayon - 4;

    // Premier œil
    setEye1({
      left: centerLocalX + moveX * 0.25 - 4,
      top: centerLocalY + moveY * 0.25,
    });

    // Deuxième œil
    setEye2({
      left: centerLocalX + moveX * 0.25 + 4,
      top: centerLocalY + moveY * 0.25,
    });

  }, [mouse, rayon]);
  return (
    <>
    
          <div
            id="cerclemain"
            className={`${width} ${height} relative  ${bgcolor} rounded-full`}
          >

            <div
              style={{
                left: eye1.left,
                top: eye1.top,
              }}
              className={`w-2  h-3 absolute rounded-full ${eyescolor}`}
            />

            <div
              style={{
                left: eye2.left,
                top: eye2.top,
              }}
              className={`w-2  h-3 absolute ml-1 rounded-full ${eyescolor}`}
            />

          </div>
    </>
  )
}
export default Logo;