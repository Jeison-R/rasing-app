import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyA255q4eJky7suVZPB02Jh7Ref-F65mPaI',
  authDomain: 'rasing-app.firebaseapp.com',
  projectId: 'rasing-app',
  storageBucket: 'rasing-app.appspot.com',
  messagingSenderId: '535367352283',
  appId: '1:535367352283:web:25f64a4365e896c807b1fe'
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Exportar almacenamiento
export const storage = getStorage(app)
