import {
  ReactElement,
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MutableRefObject,
  type MouseEvent,
  type Ref,
} from "react";

type MagnetChild = ReactElement<HTMLAttributes<HTMLElement>>;

interface MagnetProps extends HTMLAttributes<HTMLElement> {
  children: MagnetChild;
  strength?: number;
  radius?: number;
}

export const Magnet = forwardRef<HTMLElement, MagnetProps>(function Magnet(
  { children, strength = 0.35, radius = 140, ...props },
  ref
) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const distance = Math.sqrt(x * x + y * y);

    if (distance > radius) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    setOffset({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  if (!isValidElement(children)) {
    return null;
  }

  const child = children;

  const baseStyle = (child.props?.style ?? {}) as CSSProperties;
  const wrapperStyle = (props.style ?? {}) as CSSProperties;
  const mergedClassName = [props.className, child.props?.className]
    .filter(Boolean)
    .join(" ");
  const transition = baseStyle.transition
    ? `${baseStyle.transition}, transform 0.2s ease-out`
    : "transform 0.2s ease-out";

  const setRefs = (node: HTMLElement | null) => {
    containerRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as MutableRefObject<HTMLElement | null>).current = node;
    }

    const childRef = (child as ReactElement<HTMLAttributes<HTMLElement>> & { ref?: Ref<HTMLElement> }).ref;
    if (typeof childRef === "function") {
      childRef(node);
    } else if (childRef && typeof childRef === "object" && "current" in childRef) {
      (childRef as MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return cloneElement(child, {
    ...props,
    className: mergedClassName || undefined,
    ref: setRefs,
    onMouseMove: (event: MouseEvent<HTMLElement>) => {
      handleMouseMove(event);
      props.onMouseMove?.(event);
      child.props?.onMouseMove?.(event);
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      handleMouseLeave();
      props.onMouseLeave?.(event);
      child.props?.onMouseLeave?.(event);
    },
    style: {
      ...wrapperStyle,
      ...baseStyle,
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      transition,
      willChange: "transform",
    },
  } as HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> });
});
