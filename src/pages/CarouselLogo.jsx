import React, { useEffect } from "react";
import Glide from "@glidejs/glide";

import mastercard from '../img/mastercard.png'
import realince from '../img/L.5.1.png'
import tp from '../img/torrent-power-logo-png_seeklogo-182290.png'
import res from '../img/1630598252549.jpeg'
import aub from '../img/download.jpeg'
import hul from '../img/download.png'

export default function CarouselLogo() {
  useEffect(() => {
    const slider = new Glide(".glide-logo", {
      type: "carousel",
      autoplay: 1,
      animationDuration: 1000,
      animationTimingFunc: "linear",
      perView: 4,
      gap: 10,
      classes: {
        nav: {
          active: "[&>*]:bg-purple-500",
        },
      },
      breakpoints: {
        1024: { perView: 2, gap: 12 },
        640: { perView: 1, gap: 8 },
      },
    }).mount();

    return () => slider.destroy();
  }, []);

  const logos = [
    {
      src:mastercard,
      alt: "Logo 1",
      name: "Mastercard"
    },
    {
      src: realince,
      alt: "Logo 2",
      name: "Reliance"
    },
    {
      src:tp,
      alt: "Logo 3",
      name: "Torrent Power"
    },
    {
      src:res,
      alt: "Logo 4",
      name: "Resilient Tech"
    },
    {
      src:aub ,
      alt: "Logo 5",
      name: "Aubergine"
    },
    {
      src:hul ,
      alt: "Logo 6",
      name: "Hindustan Uniliver Ltd."
    },
  ];

  return (
    <>
      <div className="glide-logo relative w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <div data-glide-el="track">
          <ul className="whitespace-no-wrap flex-no-wrap [backface-visibility: hidden] [transform-style: preserve-3d] [touch-action: pan-Y] [will-change: transform] relative flex w-full overflow-hidden p-0">
            {logos.map((logo, i) => (
  logo.src ? (
    <li key={i} className="flex flex-col items-center justify-center px-4">
      <img
        src={logo.src}
        alt={logo.alt || logo.name}
        className="m-auto h-20 max-h-full w-auto max-w-full rounded-full "
      />
      <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        {logo.name}
      </p>
    </li>
  ) : null
))}

          </ul>
        </div>
      </div>
    </>
  );
}
