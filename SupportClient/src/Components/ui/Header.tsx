import { useEffect, useState } from "react";

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

const Header = () => {
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
      <div className="w-full h-10 border-b-[1px] center border-gray-400/40">
        <p className="text-sm text-[#0B1215] primary">
          This is the beta version (v1.0) of the project, developed
          specifically for a specific test case.
        </p>
      </div>

      <div className="w-full h-12 p-2 justify-between flex items-center border-b-[1px] border-gray-400/40">

        <div className="w-auto relative h-full flex space-x-1 items-center">

          <div
            id="cerclemain"
            className="w-9 h-9 relative  bg-black rounded-full"
          >

            <div
              style={{
                left: eye1.left,
                top: eye1.top,
              }}
              className="w-2  h-3 absolute rounded-full bg-white"
            />

            <div
              style={{
                left: eye2.left,
                top: eye2.top,
              }}
              className="w-2 h-3 ml-1 absolute rounded-full bg-white"
            />

          </div>

          <h1 className="primary text-[15px] tracking-tight font-bold">
            Vox-Plot
          </h1>
        </div>

        <div className="w-auto h-full flex space-x-2 items-center">

          <a className="border-[1px] border-gray-400 px-4 py-[5px] primary text-[13px] text-[#0B1215] rounded-[15px]">
            Contact Support
          </a>

          <a className="bg-[#0B1215] px-4 py-[5px] primary text-[13px] text-[#F2F6FC] rounded-[15px]">
            Log in
          </a>

        </div>
      </div>
    </>
  );
};

export default Header;