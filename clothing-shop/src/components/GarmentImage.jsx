import { COLOR_HEX } from '../data/products'

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, v + amt))
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// viewBox 200x240 기준 의류 형태
function Shape({ type, fill, stroke, line }) {
  const common = { fill, stroke, strokeWidth: 2, strokeLinejoin: 'round' }
  const ln = { fill: 'none', stroke: line, strokeWidth: 1.6, strokeLinecap: 'round' }
  switch (type) {
    case 'tee':
      return (
        <g>
          <path {...common} d="M60 42 L90 30 Q100 46 110 30 L140 42 L178 74 L160 102 L140 88 L140 204 L60 204 L60 88 L40 102 L22 74 Z" />
          <path {...ln} d="M90 30 Q100 46 110 30" />
        </g>
      )
    case 'long':
      return (
        <g>
          <path {...common} d="M60 42 L90 30 Q100 46 110 30 L140 42 L182 170 L162 177 L140 104 L140 206 L60 206 L60 104 L38 177 L18 170 Z" />
          <path {...ln} d="M90 30 Q100 46 110 30" />
          {[70, 100, 130, 160].map((y) => (<path key={y} {...ln} d={`M61 ${y} L139 ${y}`} opacity=".5" />))}
        </g>
      )
    case 'sweat':
      return (
        <g>
          <path {...common} d="M60 42 L90 30 Q100 50 110 30 L140 42 L182 172 L162 179 L140 106 L140 208 L60 208 L60 106 L38 179 L18 172 Z" />
          <path {...ln} d="M88 31 Q100 54 112 31" />
          <path {...ln} d="M60 196 L140 196 M38 179 L18 172 M162 179 L182 172" />
        </g>
      )
    case 'hoodie':
      return (
        <g>
          <path {...common} d="M60 44 L84 30 Q100 22 116 30 L140 44 L182 172 L162 179 L140 106 L140 208 L60 208 L60 106 L38 179 L18 172 Z" />
          <path {...common} d="M80 32 Q100 70 120 32 Q112 14 100 14 Q88 14 80 32Z" />
          <path {...ln} d="M92 60 L92 90 M108 60 L108 90" />
          <path {...ln} d="M76 150 L124 150 L128 186 L72 186 Z" />
        </g>
      )
    case 'shirt':
      return (
        <g>
          <path {...common} d="M60 42 L88 30 L100 44 L112 30 L140 42 L182 168 L162 175 L140 104 L140 206 L60 206 L60 104 L38 175 L18 168 Z" />
          <path {...common} d="M88 30 L100 52 L112 30 L106 28 L100 36 L94 28Z" />
          <path {...ln} d="M100 52 L100 206" />
          {[70, 100, 130, 160, 190].map((y) => (<circle key={y} cx="104" cy={y} r="1.6" fill={line} />))}
        </g>
      )
    case 'pants':
      return (
        <g>
          <path {...common} d="M62 30 L138 30 L148 218 L108 218 L100 92 L92 218 L52 218 Z" />
          <path {...ln} d="M62 42 L138 42 M100 42 L100 92" />
          <path {...ln} d="M70 54 Q82 64 80 80" />
        </g>
      )
    case 'jogger':
      return (
        <g>
          <path {...common} d="M62 30 L138 30 L146 196 Q146 218 128 218 L110 218 Q106 214 106 196 L100 92 L94 196 Q94 214 90 218 L72 218 Q54 218 54 196 Z" />
          <path {...ln} d="M62 44 L138 44 M100 44 L100 92" />
        </g>
      )
    case 'shorts':
      return (
        <g>
          <path {...common} d="M62 50 L138 50 L148 150 L108 150 L100 104 L92 150 L52 150 Z" />
          <path {...ln} d="M62 62 L138 62 M100 62 L100 104" />
        </g>
      )
    case 'jacket':
      return (
        <g>
          <path {...common} d="M58 44 L86 30 L100 46 L114 30 L142 44 L184 176 L162 184 L142 108 L142 208 L58 208 L58 108 L38 184 L16 176 Z" />
          <path {...common} d="M86 30 L100 60 L114 30 L106 26 L100 36 L94 26Z" />
          <path {...ln} d="M100 60 L100 208" />
          <path {...ln} d="M68 142 L92 142 L92 168 L68 168 Z M108 142 L132 142 L132 168 L108 168 Z" />
        </g>
      )
    case 'coat':
      return (
        <g>
          <path {...common} d="M58 44 L86 30 L100 46 L114 30 L142 44 L184 190 L162 198 L142 112 L148 232 L52 232 L58 112 L38 198 L16 190 Z" />
          <path {...common} d="M86 30 L100 66 L114 30 L106 26 L100 36 L94 26Z" />
          <path {...ln} d="M100 66 L100 232" />
          {[100, 130, 160].map((y) => (<circle key={y} cx="108" cy={y} r="2" fill={line} />))}
        </g>
      )
    case 'cap':
      return (
        <g>
          <path {...common} d="M44 138 Q44 70 102 70 Q160 70 160 138 Z" />
          <path {...common} d="M150 130 Q196 130 190 150 Q170 156 140 146 Z" />
          <path {...ln} d="M102 70 L102 138 M74 80 Q80 110 78 138 M130 80 Q124 110 126 138" />
          <circle cx="102" cy="68" r="4" fill={stroke} />
        </g>
      )
    case 'beanie':
      return (
        <g>
          <path {...common} d="M48 140 Q44 62 100 62 Q156 62 152 140 Z" />
          <rect {...common} x="44" y="136" width="112" height="30" rx="8" />
          {[62, 78, 94, 110, 126, 142].map((x) => (<path key={x} {...ln} d={`M${x} 140 L${x} 162`} opacity=".5" />))}
          <circle {...common} cx="100" cy="58" r="9" />
        </g>
      )
    case 'bag':
      return (
        <g>
          <path {...ln} strokeWidth="3" stroke={stroke} d="M72 96 Q72 40 100 40 Q128 40 128 96" />
          <path {...common} d="M44 90 L156 90 L164 212 L36 212 Z" />
          <path {...ln} d="M60 130 L140 130" opacity=".5" />
        </g>
      )
    case 'scarf':
      return (
        <g>
          <path {...common} d="M54 52 Q100 30 146 52 L150 90 Q100 70 50 90 Z" />
          <path {...common} d="M86 78 L124 82 L128 210 L84 206 Z" />
          {[92, 100, 108, 116, 124].map((x) => (<path key={x} {...ln} d={`M${x - 4} 206 L${x - 4} 220`} />))}
          <path {...ln} d="M92 100 L120 104 M92 130 L122 134 M92 160 L122 164" opacity=".5" />
        </g>
      )
    default:
      return null
  }
}

/**
 * 상품 컬러를 반영해 그리는 SVG 상품 이미지.
 * variant 0: 정면 / variant 1: 디테일(확대)
 */
export default function GarmentImage({ type, color, variant = 0, alt, className = '' }) {
  const fill = COLOR_HEX[color] ?? '#cccccc'
  const stroke = shade(fill, -55)
  const line = shade(fill, -70)
  const bg = variant === 0 ? '#efeeea' : '#e4e2dc'
  return (
    <svg
      viewBox="0 0 200 240"
      role="img"
      aria-label={alt}
      className={`block h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="200" height="240" fill={bg} />
      <ellipse cx="100" cy="228" rx="60" ry="5" fill="#000" opacity=".08" />
      <g transform={variant === 0 ? '' : 'translate(-40 -32) scale(1.4)'}>
        <Shape type={type} fill={fill} stroke={stroke} line={line} />
      </g>
    </svg>
  )
}
