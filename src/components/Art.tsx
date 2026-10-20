/** Original sprites on an integer grid, rendered without smoothing. */
export function Muffy({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path
        fill="#050505"
        d="M8 3h16v2h4v3h2v15h-4v5h-3v2H7v-2H4v-5H2V8h2V5h4Z"
      />
      <path fill="#a96b36" d="M4 9h5v13H4zm19 0h5v13h-5z" />
      <path fill="#f6c977" d="M9 5h14v3h3v14h-4v5H10v-5H6V8h3Z" />
      <path fill="#ffe4a1" d="M10 7h12v3H10zm0 10h12v7H10z" />
      <path
        fill="#050505"
        d="M9 12h3v4H9zm11 0h3v4h-3zm-6 6h5v3h-5zm1 3h3v2h-3z"
      />
      <path fill="white" d="M9 12h1v1H9zm11 0h1v1h-1z" />
      <path fill="#ff2c9c" d="M15 23h4v3h-4z" />
      <path fill="#a2ff00" d="M8 25h6v3H8zm11 0h5v3h-5z" />
      <path fill="#ffed00" d="M14 27h5v3h-5z" />
      <path fill="#f6c977" d="M5 27h7v3H5zm17 0h5v3h-5z" />
    </svg>
  );
}
export function Gift({ open = false }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 96 80" shapeRendering="crispEdges" aria-hidden="true">
      <path fill="#272727" d="M17 73h64v3H17z" />
      <path fill="#050505" d="M18 34h60v37h-4v3H22v-3h-4Z" />
      <path fill="#ff2b9e" d="M22 38h52v31H22z" />
      <path fill="#b70b69" d="M22 62h52v7H22z" />
      <path fill="#ff83c8" d="M25 40h4v20h-4z" />
      <path fill="#fff400" d="M43 38h11v31H43z" />
      <path fill="#c2ad00" d="M43 62h11v7H43z" />
      <g className={open ? "box-lid opened" : "box-lid"}>
        <path
          fill="#050505"
          d="M14 27h68v15H14zm17-14h12v4h10v-4h12v4h4v10H27V17h4z"
        />
        <path
          fill="#fff400"
          d="M31 17h8v4h4v6h-8v-4h-4zm26 0h8v6h-4v4h-8v-6h4z"
        />
        <path fill="#ff55b4" d="M18 31h60v7H18z" />
        <path fill="#fff400" d="M43 27h11v11H43z" />
        <path fill="#ffb1dc" d="M18 31h22v2H18z" />
      </g>
      <path
        fill="#fff400"
        d="M8 19h3v-3h3v3h3v3h-3v3h-3v-3H8zm73 34h3v-3h3v3h3v3h-3v3h-3v-3h-3z"
      />
      <path fill="#a2ff00" d="M77 12h3v3h-3zm-67 43h3v3h-3z" />
      <path
        fill="#ff2b9e"
        d="M77 23h3v3h3v-3h3v6h-3v3h-3v-3h-3zM8 38h3v3h3v-3h3v6h-3v3h-3v-3H8z"
      />
      <path fill="#fff" d="M60 48h11v13H60z" />
      <path fill="#050505" d="M63 51h5v2h-5zm0 4h5v2h-5z" />
    </svg>
  );
}
export function Cup({
  strawberry = false,
  ice = false,
  fill = true,
}: {
  strawberry?: boolean;
  ice?: boolean;
  fill?: boolean;
}) {
  return (
    <svg viewBox="0 0 32 40" shapeRendering="crispEdges" aria-hidden="true">
      <path fill="#050505" d="M6 7h22v6h-2v20h-2v3H10v-3H8V13H6z" />
      <path fill="#eeeede" d="M8 9h18v3h-2v20h-2v2H12v-2h-2V12H8z" />
      {fill && (
        <>
          <path
            fill={strawberry ? "#ff6bbb" : "#a2ff00"}
            d="M10 18h14v14h-2v2H12v-2h-2Z"
          />
          <path fill="#65a400" d="M10 27h14v5h-2v2H12v-2h-2Z" />
        </>
      )}
      <path fill="#050505" d="M20 2h3v18h-3z" />
      <path fill="#a2ff00" d="M20 2h1v18h-1z" />
      {ice && <path fill="#fff" d="M12 17h4v4h-4zm7 4h3v4h-3z" />}
      <path fill="#fff" d="M11 12h2v4h-2zm0 12h1v6h-1z" />
      <path fill="#050505" d="M13 25h2v2h-2zm6 0h2v2h-2zm-4 4h4v1h-4z" />
    </svg>
  );
}
export function PixelIcon({ type }: { type: "star" | "trophy" | "shred" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {type === "star" ? (
        <path d="M10 1h4v5h3v3h7v4h-4v3h-3v4h3v4h-6v-3h-4v3H4v-4h3v-4H4v-3H0V9h7V6h3z" />
      ) : type === "trophy" ? (
        <>
          <path d="M6 2h12v3h5v10h-5v3h-4v3h5v3H5v-3h5v-3H6v-3H1V5h5zm-2 6v4h2V8zm14 0v4h2V8z" />
          <path fill="#050505" d="M9 5h2v8H9z" />
        </>
      ) : (
        <>
          <path d="M5 0h14v9h4v12h-4v3h-3v-5h-2v5h-3v-5H9v5H6v-3H1V9h4z" />
          <path fill="#050505" d="M7 2h10v8H7zM4 13h16v2H4z" />
          <path fill="currentColor" d="M9 4h6v1H9zm0 3h6v1H9z" />
        </>
      )}
    </svg>
  );
}
