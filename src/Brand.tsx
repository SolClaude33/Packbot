export function PackbotMark({ light = false }: { light?: boolean }) {
  return (
    <a className={`brand packbot-wordmark${light ? ' brand-light' : ''}`} href="/" aria-label="Packbot home">
      <svg viewBox="0 0 550 108" fill="none" aria-hidden="true">
        <path transform="scale(3.4)" fill="currentColor" fillRule="evenodd" d="M16 3C24 3 30 9 30 17C30 25 25 29 16 29C7 29 2 25 2 17C2 9 8 3 16 3ZM9.55 11.7A2 2 0 0 1 13.49 12.39L12.45 18.3A2 2 0 0 1 8.51 17.61ZM19.55 11.7A2 2 0 0 1 23.49 12.39L22.45 18.3A2 2 0 0 1 18.51 17.61Z" />
        <g transform="translate(124)" stroke="currentColor" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 94V33M16 49C16 34 22 25 37 25C51 25 61 35 61 49C61 63 51 73 37 73C22 73 16 64 16 49Z" />
          <path d="M122 26V73M122 49C122 35 114 25 100 25C86 25 77 35 77 49C77 63 86 73 100 73C114 73 122 63 122 49Z" />
          <path d="M179 29C174 26 169 25 163 25C148 25 139 35 139 49C139 63 148 73 163 73C169 73 175 71 179 68" />
          <path d="M201 13V73M232 27L203 49L236 73M256 13V73M256 49C256 34 262 25 277 25C291 25 301 35 301 49C301 63 291 73 277 73C262 73 256 64 256 49Z" />
          <ellipse cx="341" cy="49" rx="24" ry="24" />
          <path d="M389 13V58C389 69 394 73 403 73H408M377 29H410" />
        </g>
      </svg>
    </a>
  )
}
