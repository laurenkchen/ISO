import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex p-6 h-screen w-full bg-[url('./assets/clouds.jpeg')] bg-cover bg-center bg-no-repeat font-[Libre-Baskerville]">
        <div className="flex pl-6 flex-col justify-end ">
          <p className="py-2 text-2xl text-[#F4EFE5]">laurenchen.net</p>
          <h1 className="py-2 text-8xl text-[#F4EFE5] italic">ISO</h1>
          <p className="py-2 pb-16 text-2xl text-[#F4EFE5]">A photobooth, but with gifs</p>
        </div>
        <div className="flex flex-col ml-9 pl-9 items-center">
          <div>
            <h1 className="text-[#F4EFE5] opacity-50 text-2xl">"not all those who wander are lost"</h1>
            <h1 className="text-[#F4EFE5] opacity-50">-J.R.R. Tolkein</h1>

          </div>
          <img src={heroImg} alt="hero" className="w-[300px] h-[400px]" />
          <div className="flex ">
            <button className="text-[#F4EFE5] text-2xl outline outline-2 p-2 px-9 rounded-xl ">begin</button>
            <button className="text-[#F4EFE5]">a</button>
            <button className="text-[#F4EFE5]">b</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
