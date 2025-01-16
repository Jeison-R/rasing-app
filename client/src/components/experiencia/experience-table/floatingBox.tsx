import React, { useState } from 'react'

interface FloatingBoxProps {
  totalSum: string
  rupNumbers: string[] // Arreglo de números de RUP seleccionados
  areaIntervenida: number // Área intervenida
  areaBajoCubierta: number
  longitudIntervenida: number
  tipoContrato: string
}

function FloatingBox({ totalSum, rupNumbers, areaIntervenida, areaBajoCubierta, longitudIntervenida, tipoContrato }: FloatingBoxProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev)
  }

  return (
    <div style={styles.floatingBox}>
      <div style={styles.header}>
        <span>Información Seleccionada</span>
        <button style={styles.toggleButton} type="button" onClick={toggleMinimize}>
          {isMinimized ? '+' : '-'}
        </button>
      </div>
      {!isMinimized && (
        <div style={styles.content}>
          <p style={styles.text}>
            <strong>Suma total del Valor SMMlV part:</strong> {totalSum}
          </p>
          {tipoContrato === 'Edificación' && (
            <>
              <p style={styles.text}>
                <strong>Área intervenida:</strong> {areaIntervenida}
              </p>
              <p style={styles.text}>
                <strong>Área bajo cubierta:</strong> {areaBajoCubierta}
              </p>
            </>
          )}
          {tipoContrato === 'Vías' && (
            <p style={styles.text}>
              <strong>Longitud Intervenida:</strong> {longitudIntervenida}
            </p>
          )}
          <p style={styles.text}>
            <strong>RUP seleccionado{rupNumbers.length > 1 ? 's' : ''}:</strong> {rupNumbers.length > 0 ? rupNumbers.join(', ') : 'Ninguno'}
          </p>
        </div>
      )}
    </div>
  )
}

const styles = {
  floatingBox: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    width: '250px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#EE9820',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer'
  },
  content: {
    padding: '10px 15px',
    fontSize: '14px'
  },
  text: {
    margin: '5px 0'
  }
}

export default FloatingBox
