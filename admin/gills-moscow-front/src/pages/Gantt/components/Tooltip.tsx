import { useEffect, useState } from "react";

const Tooltip = ({
  content,
  left,
  top,
  tooltipRef,
}: {
  content: string;
  left: number;
  top: number;
  tooltipRef: React.RefObject<HTMLDivElement>;
}) => {
  const [position, setPosition] = useState<{ left: number; top: number }>({
    left,
    top,
  });

  useEffect(() => {
    const updateTooltipPosition = () => {
      const tooltipElement = tooltipRef.current;
      if (tooltipElement) {
        const tooltipWidth = tooltipElement.offsetWidth;
        const tooltipHeight = tooltipElement.offsetHeight;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let newLeft = left;
        let newTop = top;

        // Корректировка по горизонтали
        if (left + tooltipWidth > screenWidth) {
          newLeft = screenWidth - tooltipWidth - 10; // 10px отступ от правого края
        } else if (left < 0) {
          newLeft = 10; // 10px отступ от левого края
        }

        // Корректировка по вертикали
        if (top + tooltipHeight > screenHeight) {
          newTop = screenHeight - tooltipHeight - 10; // 10px отступ от нижнего края
        } else if (top < 0) {
          newTop = 10; // 10px отступ от верхнего края
        }

        setPosition({ left: newLeft, top: newTop });
      }
    };

    updateTooltipPosition();
    window.addEventListener("resize", updateTooltipPosition);

    return () => {
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, [left, top, tooltipRef]);

  return (
    <div
      ref={tooltipRef}
      className="absolute bg-[#f3f4f6] text-sm rounded z-[100] px-5 py-[15px] w-[214px] shadow-lightGray"
      style={{ left: position.left, top: position.top }}
    >
      <div className="font-semibold text-[#161616]">
        {JSON.parse(content).title}
      </div>
      <div className="text-[#161616] text-[12px]">
        {JSON.parse(content).comment}
      </div>
    </div>
  );
};

export default Tooltip;
