const icons = {
  document: (
    <path d="M8 4.75h5.5L18.25 9v10.25A1.75 1.75 0 0 1 16.5 21h-8A1.75 1.75 0 0 1 6.75 19.25V6.5A1.75 1.75 0 0 1 8.5 4.75Z M13.25 4.75V9H17.5" />
  ),
  layers: (
    <path d="m12.5 5.5 7 3.75-7 3.75-7-3.75 7-3.75Zm-7 7.25 7 3.75 7-3.75M5.5 16.25 12.5 20l7-3.75" />
  ),
  support: (
    <path d="M6.5 12.5A6 6 0 1 1 18.5 12.5v3.25a1.5 1.5 0 0 1-1.5 1.5h-1.75v-4.5h3.25M6.75 12.75H3.5m3.25 4.5H5a1.5 1.5 0 0 1-1.5-1.5V12.5m8.25 4.75a2.5 2.5 0 0 1-2.5 2.5H8.5" />
  ),
  market: (
    <path d="M5.5 18.5h13M7.5 15l3-3 2.25 2.25L18.5 8.5M15.25 8.5H18.5v3.25" />
  ),
  clarity: (
    <path d="M12.5 4.75 14.4 8.6l4.25.62-3.08 3 .73 4.23-3.8-2-3.8 2 .73-4.23-3.08-3 4.25-.62 1.9-3.85Z" />
  ),
  mail: (
    <path d="M5.5 7.25h14v9.5h-14v-9.5Zm0 .5 7 5 7-5" />
  ),
  chat: (
    <path d="M7.5 18.5v-3H6.25A1.75 1.75 0 0 1 4.5 13.75V7.25A1.75 1.75 0 0 1 6.25 5.5h12.5A1.75 1.75 0 0 1 20.5 7.25v6.5a1.75 1.75 0 0 1-1.75 1.75H12l-4.5 3Z" />
  ),
  upload: (
    <path d="M12.5 15.5v-8m0 0-3 3m3-3 3 3M6.75 18.5h11.5" />
  )
};

export default function Icon({ name, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}
