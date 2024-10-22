import type { StylesConfig } from 'react-select'

interface Option {
  value: string
  label: string
}

export const getCustomSelectStyles: StylesConfig<Option, true> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#fff', // Fondo blanco por defecto (modo claro)
    color: '#000', // Texto negro por defecto
    borderColor: '#ccc', // Borde gris por defecto
    '&:hover': {
      borderColor: '#000' // Borde negro al pasar el mouse
    },
    // Cuando está en modo oscuro, cambian los estilos
    '.dark &': {
      backgroundColor: 'hsl(20,14.3%,4.1%)', // Fondo oscuro en modo dark
      color: '#fff', // Texto blanco en modo dark
      borderColor: 'gray' // Borde gris en modo dark
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#fff', // Fondo blanco por defecto
    color: '#000',
    '.dark &': {
      backgroundColor: 'hsl(20,14.3%,4.1%)', // Fondo oscuro en modo dark
      color: '#fff'
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f0f0f0' : '#fff', // Fondo blanco cuando está enfocado en modo claro
    color: '#000',
    '.dark &': {
      backgroundColor: state.isFocused ? 'hsl(20,14.3%,10%)' : 'hsl(20,14.3%,4.1%)', // Fondo oscuro en modo dark
      color: '#fff'
    }
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'lightgray', // Fondo claro por defecto
    color: '#000',
    '.dark &': {
      backgroundColor: 'gray', // Fondo gris en modo dark
      color: '#fff'
    }
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#000',
    '.dark &': {
      color: '#fff' // Texto blanco en modo dark
    }
  })
}
