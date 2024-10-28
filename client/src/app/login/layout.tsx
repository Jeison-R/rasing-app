export default function SpecialLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div id="special-layout">{children}</div>
      </body>
    </html>
  )
}
