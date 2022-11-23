import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import axios from 'axios'

let socket: Socket

const Home = () => {
  const [input, setInput] = useState('')
  const [listaNotas, setListaNotas] = useState([])
  const [media, setMedia] = useState<string|null>(null)

  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async () => {
    await axios.post('/api/socket')

    socket = io()

    socket.on('connect', () => {
      socket.emit('user-connected', true)
      console.log('Usuários conectados')
    })

    socket.on('update-input', msg => {
      let somas = 0
      let total = 0
      let lista = msg.split('\n')

      lista.map((item: string) => {
        somas += parseFloat(item)
        total++
      })

      setListaNotas(lista)
      setMedia((somas / total).toFixed(2).toString())
    })
  }

  const handleEmitNotas = () => socket.emit('input-change', input)

  return (
    <div>
      <h2>Olá, digite uma nota por linha:</h2>
      <textarea cols={30} rows={10} onChange={(e) => setInput(e.target.value)}></textarea>
      <br />
      <button onClick={handleEmitNotas}>Calcular Média</button>
      <ul>
        {listaNotas.map((item, key) => (
          <li key={key}>{(key - 1) == key ? `Média` : `Nota`} {key + 1}: <b>{item}</b></li>
        ))}
      </ul>
      {media && <p>Média das notas é: <b>{media}</b></p>}
    </div>
  )
}

export default Home