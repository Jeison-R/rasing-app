import { type SVGProps } from 'react'

export function Logo(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg data-name="Capa 2" viewBox="0 0 501 480" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g data-name="Capa 1">
        <path
          d="M314 0v480H197.6l-3.5-154.5-70.6 29.6L137.6 480H35.3L0 161.1 314 0Z"
          style={{
            fill: '#ee9920',
            strokeWidth: 0
          }}
        />
        <path
          d="M335.2 0 501 72.8 451.6 480H335.2V0Z"
          style={{
            fill: '#8d7f62',
            strokeWidth: 0
          }}
        />
        <path
          d="m382.3 480 91.6-419.1L501 72.8 451.6 480h-69.3z"
          style={{
            strokeWidth: 0,
            fill: '#80765e'
          }}
        />
      </g>
    </svg>
  )
}
