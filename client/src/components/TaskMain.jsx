import { formatDate } from "../utils/formatDate";

import { useRef, useState, useEffect } from "react";

import PdfViewer from "./PdfViewer";

const isPdf = (url) => url.toLowerCase().endsWith(".pdf");

const TaskMain = ({ item }) => {
  const sliderRef = useRef(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateButtons = () => {
    const el = sliderRef.current;
    if (!el) return;

    setCanScrollPrev(el.scrollLeft > 0);

    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    const slideWidth = sliderRef.current.firstChild?.offsetWidth || 300;

    sliderRef.current.scrollBy({
      left: direction === "next" ? slideWidth : -slideWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateButtons();

    const el = sliderRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  return (
    <main className="card-item-main">
      <h2 className="fs-x-large bold">{item.title}</h2>
      <p>{item.description}</p>

      {item.images.length > 0 ? (
        <div className="card-carrousel-wrapper">
          <button
            className="card-carrousel-button left"
            onClick={() => scroll("prev")}
            disabled={!canScrollPrev}
            aria-label="Anterior"
          >
            ‹
          </button>
          <ul className="card-carrousel-list reset-list" ref={sliderRef}>
            {item.images.map((file, index) => (
              <li key={index}>
                <div className="card-carrousel-wrapper-file">
                  {isPdf(file) ? (
                    <PdfViewer file={file} />
                  ) : (
                    <img
                      src={file}
                      alt={`Archivo ${index + 1} de ${item.title}`}
                      loading="lazy"
                      className="card-carrousel-img"
                    />
                  )}
                </div>
                <div className="card-carrousel-actions">
                  <a
                    href={file}
                    download
                    target="_blank"
                    className="button-solid-l button-solid-l-accent flex flex-a-center flex-gap-1"
                  >
                    <img
                      style={{ height: "20px" }}
                      src="/assets/imgs/icon-eye.svg"
                      alt=""
                    />
                    <span>Ver</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="card-carrousel-button right"
            onClick={() => scroll("next")}
            disabled={!canScrollNext}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      ) : (
        ""
      )}
    </main>
  );
};

export default TaskMain;
